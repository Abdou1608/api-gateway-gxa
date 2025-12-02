import type { FastifyInstance } from 'fastify';
import fs from 'fs/promises';
import path from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';
import { spawn } from 'child_process';
import mammoth from 'mammoth';
import puppeteer from 'puppeteer';

const PDF_BASE_STYLES = `
body {
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
  font-size: 12px;
  color: #111;
}
h1, h2, h3 {
  font-weight: 600;
  margin-top: 0;
}
table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1rem;
}
td, th {
  border: 1px solid #999;
  padding: 4px 6px;
  font-size: 11px;
}
ul {
  margin: 0 0 0.5rem 1.25rem;
}
`;

const HTML_PDF_FALLBACK_DISABLED = process.env.EXPORT_PDF_FALLBACK === '0';

/**
 * Conversion via LibreOffice (soffice) : DOCX -> PDF
 */
async function convertDocxToPdf(
  inputPath: string,
  outputPath: string,
  sofficePath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(sofficePath, [
      '--headless',
      '--convert-to',
      'pdf',
      '--outdir',
      path.dirname(outputPath),
      inputPath,
    ]);

    proc.on('error', (err) => reject(err));
    proc.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`LibreOffice exited with code ${code}`));
      }
    });
  });
}

/**
 * Fallback : DOCX -> HTML (mammoth) puis HTML -> PDF (Chromium/Puppeteer)
 */
async function convertDocxWithChromium(buffer: Buffer, _fileName: string): Promise<Buffer> {
  const { value: html } = await mammoth.convertToHtml({ buffer });
  const documentHtml = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>${PDF_BASE_STYLES}</style></head><body>${html}</body></html>`;

  const browser = await puppeteer.launch({
    headless: true, // ✅ correction : 'new' -> true
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(documentHtml, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      margin: { top: '12mm', bottom: '12mm', left: '14mm', right: '14mm' },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

/**
 * Détermine si on doit basculer sur le fallback HTML/Chromium
 */
function shouldFallbackToChromium(error: unknown, ext: string): boolean {
  if (HTML_PDF_FALLBACK_DISABLED) return false;
  if (ext !== '.docx') return false;

  if (!error) return true;

  const message =
    typeof error === 'string' ? error : (error as Error)?.message ?? '';
  const code = (error as NodeJS.ErrnoException)?.code;

  return code === 'ENOENT' || /libreoffice/i.test(message) || /soffice/i.test(message);
}

export default async function routes(app: FastifyInstance) {
  /**
   * IMPORTANT :
   * La route /api/tools/convert/doc-to-docx a été SUPPRIMÉE,
   * car tous les templates sont déjà en DOCX.
   */

  app.post('/api/tools/convert/docx-to-pdf', async (req, reply) => {
    const parts = req.parts ? req.parts() : null;
    if (!parts) {
      return reply.status(400).send({ error: 'No file uploaded' });
    }

    let filePart: any = null;

    for await (const part of parts) {
      if (part.type === 'file' && part.fieldname === 'file') {
        filePart = part;
        break;
      }
    }

    if (!filePart) {
      return reply.status(400).send({ error: 'No file uploaded' });
    }

    const originalFilename: string = filePart.filename || 'document.docx';
    const ext = path.extname(originalFilename).toLowerCase();

    // On ne gère plus que les DOCX
    if (ext !== '.docx') {
      return reply
        .status(400)
        .send({
          error:
            'File must be .docx (legacy .doc is no longer supported on this endpoint)',
        });
    }

    const sofficePath = process.env.SOFFICE_PATH || 'soffice';
    const tmpBase = tmpdir();
    const id = randomBytes(8).toString('hex');

    const inputPath = path.join(tmpBase, `${id}${ext}`); // toujours .docx
    const outputPath = path.join(tmpBase, `${id}.pdf`);

    let pdf: Buffer | null = null;

    try {
      const fileBuffer: Buffer = await filePart.toBuffer();
      await fs.writeFile(inputPath, fileBuffer);

      try {
        // Tentative 1 : LibreOffice
        await convertDocxToPdf(inputPath, outputPath, sofficePath);
        pdf = await fs.readFile(outputPath);
      } catch (libreError: any) {
        // Fallback HTML/Chromium uniquement pour .docx
        if (shouldFallbackToChromium(libreError, ext)) {
          req.log.warn(
            { err: libreError },
            'LibreOffice conversion failed, falling back to mammoth/Chromium pipeline'
          );
          pdf = await convertDocxWithChromium(fileBuffer, originalFilename);
        } else {
          throw libreError;
        }
      }

      if (!pdf) {
        throw new Error('PDF conversion failed without producing output');
      }

      reply.header('Content-Type', 'application/pdf');
      reply.header(
        'Content-Disposition',
        `attachment; filename="${originalFilename.replace(/\.docx$/i, '.pdf')}"`
      );
      return reply.send(pdf);
    } catch (e: any) {
      req.log.error({ err: e }, 'DOCX to PDF conversion failed');
      return reply
        .status(500)
        .send({ error: e.message || 'DOCX to PDF conversion failed' });
    } finally {
      // Nettoyage des fichiers temporaires
      fs.unlink(inputPath).catch(() => {});
      fs.unlink(outputPath).catch(() => {});
    }
  });

  app.get('/api/tools/convert/health', async (_req, reply) => {
    const sofficePath = process.env.SOFFICE_PATH || 'soffice';

    try {
      const proc = spawn(sofficePath, ['--version']);
      let version = '';

      proc.stdout.on('data', (d) => {
        version += d.toString();
      });

      proc.on('exit', (code) => {
        if (code === 0) {
          reply.send({
            ok: true,
            version: version.trim(),
            path: sofficePath,
          });
        } else {
          reply.send({
            ok: false,
            error: 'LibreOffice not found',
            path: sofficePath,
          });
        }
      });
    } catch (e: any) {
      reply.send({
        ok: false,
        error: e.message,
        path: sofficePath,
      });
    }
  });
}
