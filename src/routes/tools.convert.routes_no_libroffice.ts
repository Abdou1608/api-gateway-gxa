import type { FastifyInstance } from 'fastify';
import fs from 'fs/promises';
import path from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';
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

/**
 * Conversion DOCX -> HTML (mammoth) puis HTML -> PDF (Chromium/Puppeteer)
 */
async function convertDocxWithChromium(buffer: Buffer, _fileName: string): Promise<Buffer> {
  // 1) DOCX -> HTML avec Mammoth
  const { value: html } = await mammoth.convertToHtml({ buffer });

  const documentHtml = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <style>${PDF_BASE_STYLES}</style>
</head>
<body>
  ${html}
</body>
</html>`;

  // 2) HTML -> PDF avec Puppeteer
  const browser = await puppeteer.launch({
    headless: true, // ✅ compatible avec ta version de types
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

export default async function routes(app: FastifyInstance) {
  /**
   * Route unique : DOCX -> PDF
   * (plus de support .doc, plus de LibreOffice)
   */
  app.post('/api/tools/convert/docx-to-pdf', async (req, reply) => {
    const parts = req.parts ? req.parts() : null;
    if (!parts) {
      return reply.status(400).send({ error: 'No file uploaded' });
    }

    let filePart: any = null;

    // Récupération de la partie "file"
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

    // On ne gère plus que les .docx
    if (ext !== '.docx') {
      return reply
        .status(400)
        .send({ error: 'File must be .docx (legacy .doc is no longer supported)' });
    }

    // On peut encore utiliser des fichiers temporaires SI tu veux logger ou déboguer,
    // mais ici on pourrait aussi travailler directement sur le buffer.
    const tmpBase = tmpdir();
    const id = randomBytes(8).toString('hex');
    const inputPath = path.join(tmpBase, `${id}${ext}`);

    try {
      const fileBuffer: Buffer = await filePart.toBuffer();
      await fs.writeFile(inputPath, fileBuffer);

      // Conversion 100% Mammoth + Puppeteer
      const pdfBuffer = await convertDocxWithChromium(fileBuffer, originalFilename);

      reply.header('Content-Type', 'application/pdf');
      reply.header(
        'Content-Disposition',
        `attachment; filename="${originalFilename.replace(/\.docx$/i, '.pdf')}"`
      );
      return reply.send(pdfBuffer);
    } catch (e: any) {
      req.log.error({ err: e }, 'DOCX to PDF conversion failed (mammoth+puppeteer)');
      return reply
        .status(500)
        .send({ error: e.message || 'DOCX to PDF conversion failed' });
    } finally {
      // Nettoyage du fichier temporaire
      fs.unlink(inputPath).catch(() => {});
    }
  });

  /**
   * Health check simple pour vérifier que Puppeteer fonctionne
   * (utile pour du monitoring / readiness probe Kubernetes, etc.)
   */
  app.get('/api/tools/convert/health', async (_req, reply) => {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      await browser.close();

      reply.send({
        ok: true,
        engine: 'mammoth+puppeteer',
      });
    } catch (e: any) {
      reply.send({
        ok: false,
        engine: 'mammoth+puppeteer',
        error: e.message,
      });
    }
  });
}
