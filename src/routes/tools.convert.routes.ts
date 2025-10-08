import type { FastifyInstance } from 'fastify';
import fs from 'fs/promises';
import path from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';
import { spawn } from 'child_process';

async function convertDocxToPdf(inputPath: string, outputPath: string, sofficePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(sofficePath, [
      '--headless',
      '--convert-to', 'pdf',
      '--outdir', path.dirname(outputPath),
      inputPath
    ]);
    proc.on('error', reject);
    proc.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`LibreOffice exited with code ${code}`));
    });
  });
}

export default async function routes(app: FastifyInstance) {
    app.post('/api/tools/convert/doc-to-docx', async (req, reply) => {
      const parts = req.parts ? req.parts() : null;
      if (!parts) return reply.status(400).send({ error: 'No file uploaded' });
      let filePart = null;
      for await (const part of parts) {
        if (part.type === 'file' && part.fieldname === 'file') {
          filePart = part;
          break;
        }
      }
      if (!filePart) return reply.status(400).send({ error: 'No file uploaded' });
      if (!filePart.filename.endsWith('.doc')) {
        return reply.status(400).send({ error: 'File must be .doc' });
      }

      const sofficePath = process.env.SOFFICE_PATH || 'soffice';
      const tmpBase = tmpdir();
      const id = randomBytes(8).toString('hex');
      const inputPath = path.join(tmpBase, `${id}.doc`);
      const outputPath = path.join(tmpBase, `${id}.docx`);

      try {
        const fileBuffer = await filePart.toBuffer();
        await fs.writeFile(inputPath, fileBuffer);
        // Use LibreOffice to convert DOC to DOCX
        await new Promise((resolve, reject) => {
          const proc = spawn(sofficePath, [
            '--headless',
            '--convert-to', 'docx',
            '--outdir', path.dirname(outputPath),
            inputPath
          ]);
          proc.on('error', reject);
          proc.on('exit', (code) => {
            if (code === 0) resolve(undefined);
            else reject(new Error(`LibreOffice exited with code ${code}`));
          });
        });
        const docx = await fs.readFile(outputPath);
        reply.header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        reply.header('Content-Disposition', `attachment; filename="${filePart.filename.replace(/\.doc$/, '.docx')}"`);
        return reply.send(docx);
      } catch (e: any) {
        return reply.status(500).send({ error: e.message });
      } finally {
        fs.unlink(inputPath).catch(() => {});
        fs.unlink(outputPath).catch(() => {});
      }
    });
  app.post('/api/tools/convert/docx-to-pdf', async (req, reply) => {
    const parts = req.parts ? req.parts() : null;
    if (!parts) return reply.status(400).send({ error: 'No file uploaded' });
    let filePart = null;
    for await (const part of parts) {
      if (part.type === 'file' && part.fieldname === 'file') {
        filePart = part;
        break;
      }
    }
    if (!filePart) return reply.status(400).send({ error: 'No file uploaded' });
    if (!filePart.filename.endsWith('.docx') && !filePart.filename.endsWith('.doc')) {
      return reply.status(400).send({ error: 'File must be .doc or .docx' });
    }

    const sofficePath = process.env.SOFFICE_PATH || 'soffice';
    const tmpBase = tmpdir();
    const id = randomBytes(8).toString('hex');
    const ext = filePart.filename.endsWith('.docx') ? '.docx' : '.doc';
    const inputPath = path.join(tmpBase, `${id}${ext}`);
    const outputPath = path.join(tmpBase, `${id}.pdf`);

    try {
      const fileBuffer = await filePart.toBuffer();
      await fs.writeFile(inputPath, fileBuffer);
      await convertDocxToPdf(inputPath, outputPath, sofficePath);
      const pdf = await fs.readFile(outputPath);
      reply.header('Content-Type', 'application/pdf');
      reply.header('Content-Disposition', `attachment; filename="${filePart.filename.replace(/\.(docx|doc)$/, '.pdf')}"`);
      return reply.send(pdf);
    } catch (e: any) {
      return reply.status(500).send({ error: e.message });
    } finally {
      fs.unlink(inputPath).catch(() => {});
      fs.unlink(outputPath).catch(() => {});
    }
  });

  app.get('/api/tools/convert/health', async (_req, reply) => {
    const sofficePath = process.env.SOFFICE_PATH || 'soffice';
    try {
      const proc = spawn(sofficePath, ['--version']);
      let version = '';
      proc.stdout.on('data', (d) => { version += d.toString(); });
      proc.on('exit', (code) => {
        if (code === 0) reply.send({ ok: true, version: version.trim(), path: sofficePath });
        else reply.send({ ok: false, error: 'LibreOffice not found', path: sofficePath });
      });
    } catch (e: any) {
      reply.send({ ok: false, error: e.message, path: sofficePath });
    }
  });
}
