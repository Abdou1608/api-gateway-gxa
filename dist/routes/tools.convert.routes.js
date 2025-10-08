"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = routes;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const os_1 = require("os");
const crypto_1 = require("crypto");
const child_process_1 = require("child_process");
async function convertDocxToPdf(inputPath, outputPath, sofficePath) {
    return new Promise((resolve, reject) => {
        const proc = (0, child_process_1.spawn)(sofficePath, [
            '--headless',
            '--convert-to', 'pdf',
            '--outdir', path_1.default.dirname(outputPath),
            inputPath
        ]);
        proc.on('error', reject);
        proc.on('exit', (code) => {
            if (code === 0)
                resolve();
            else
                reject(new Error(`LibreOffice exited with code ${code}`));
        });
    });
}
async function routes(app) {
    app.post('/api/tools/convert/doc-to-docx', async (req, reply) => {
        const parts = req.parts ? req.parts() : null;
        if (!parts)
            return reply.status(400).send({ error: 'No file uploaded' });
        let filePart = null;
        for await (const part of parts) {
            if (part.type === 'file' && part.fieldname === 'file') {
                filePart = part;
                break;
            }
        }
        if (!filePart)
            return reply.status(400).send({ error: 'No file uploaded' });
        if (!filePart.filename.endsWith('.doc')) {
            return reply.status(400).send({ error: 'File must be .doc' });
        }
        const sofficePath = process.env.SOFFICE_PATH || 'soffice';
        const tmpBase = (0, os_1.tmpdir)();
        const id = (0, crypto_1.randomBytes)(8).toString('hex');
        const inputPath = path_1.default.join(tmpBase, `${id}.doc`);
        const outputPath = path_1.default.join(tmpBase, `${id}.docx`);
        try {
            const fileBuffer = await filePart.toBuffer();
            await promises_1.default.writeFile(inputPath, fileBuffer);
            // Use LibreOffice to convert DOC to DOCX
            await new Promise((resolve, reject) => {
                const proc = (0, child_process_1.spawn)(sofficePath, [
                    '--headless',
                    '--convert-to', 'docx',
                    '--outdir', path_1.default.dirname(outputPath),
                    inputPath
                ]);
                proc.on('error', reject);
                proc.on('exit', (code) => {
                    if (code === 0)
                        resolve(undefined);
                    else
                        reject(new Error(`LibreOffice exited with code ${code}`));
                });
            });
            const docx = await promises_1.default.readFile(outputPath);
            reply.header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            reply.header('Content-Disposition', `attachment; filename="${filePart.filename.replace(/\.doc$/, '.docx')}"`);
            return reply.send(docx);
        }
        catch (e) {
            return reply.status(500).send({ error: e.message });
        }
        finally {
            promises_1.default.unlink(inputPath).catch(() => { });
            promises_1.default.unlink(outputPath).catch(() => { });
        }
    });
    app.post('/api/tools/convert/docx-to-pdf', async (req, reply) => {
        const parts = req.parts ? req.parts() : null;
        if (!parts)
            return reply.status(400).send({ error: 'No file uploaded' });
        let filePart = null;
        for await (const part of parts) {
            if (part.type === 'file' && part.fieldname === 'file') {
                filePart = part;
                break;
            }
        }
        if (!filePart)
            return reply.status(400).send({ error: 'No file uploaded' });
        if (!filePart.filename.endsWith('.docx') && !filePart.filename.endsWith('.doc')) {
            return reply.status(400).send({ error: 'File must be .doc or .docx' });
        }
        const sofficePath = process.env.SOFFICE_PATH || 'soffice';
        const tmpBase = (0, os_1.tmpdir)();
        const id = (0, crypto_1.randomBytes)(8).toString('hex');
        const ext = filePart.filename.endsWith('.docx') ? '.docx' : '.doc';
        const inputPath = path_1.default.join(tmpBase, `${id}${ext}`);
        const outputPath = path_1.default.join(tmpBase, `${id}.pdf`);
        try {
            const fileBuffer = await filePart.toBuffer();
            await promises_1.default.writeFile(inputPath, fileBuffer);
            await convertDocxToPdf(inputPath, outputPath, sofficePath);
            const pdf = await promises_1.default.readFile(outputPath);
            reply.header('Content-Type', 'application/pdf');
            reply.header('Content-Disposition', `attachment; filename="${filePart.filename.replace(/\.(docx|doc)$/, '.pdf')}"`);
            return reply.send(pdf);
        }
        catch (e) {
            return reply.status(500).send({ error: e.message });
        }
        finally {
            promises_1.default.unlink(inputPath).catch(() => { });
            promises_1.default.unlink(outputPath).catch(() => { });
        }
    });
    app.get('/api/tools/convert/health', async (_req, reply) => {
        const sofficePath = process.env.SOFFICE_PATH || 'soffice';
        try {
            const proc = (0, child_process_1.spawn)(sofficePath, ['--version']);
            let version = '';
            proc.stdout.on('data', (d) => { version += d.toString(); });
            proc.on('exit', (code) => {
                if (code === 0)
                    reply.send({ ok: true, version: version.trim(), path: sofficePath });
                else
                    reply.send({ ok: false, error: 'LibreOffice not found', path: sofficePath });
            });
        }
        catch (e) {
            reply.send({ ok: false, error: e.message, path: sofficePath });
        }
    });
}
