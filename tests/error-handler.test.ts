import request from 'supertest';
import express from 'express';
import { errorHandler, notFoundHandler } from '../src/middleware/error-handler';
import { correlationId } from '../src/middleware/correlation';
import { ValidationError, SoapServerError } from '../src/common/errors';

function makeApp() {
	const app = express();
	app.use(express.json());
	app.use(correlationId);
	app.get('/ok', (_req, res) => res.json({ ok: true }));
	app.get('/boom', (_req, _res, next) => next(new ValidationError('Invalid', [{ path: 'x', message: 'missing' }])));
	app.get('/soap', (_req, _res, next) => next(new SoapServerError('SOAP.FAULT', 'Faulted', { soapFault: { faultcode: 'Client', faultstring: 'Boom' } })));
	app.use(notFoundHandler);
	app.use(errorHandler);
	return app;
}

describe('global error handling', () => {
	it('returns standard validation error payload', async () => {
		const res = await request(makeApp()).get('/boom');
		expect(res.status).toBe(400);
		expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
		expect(res.body?.status).toBe(400);
		expect(res.body?.errorType).toBe('VALIDATION_ERROR');
		expect(res.body?.code).toBe('VALIDATION.INVALID_BODY');
		expect(res.headers['x-error-type']).toBe('VALIDATION_ERROR');
		expect(res.headers['x-error-code']).toBe('VALIDATION.INVALID_BODY');
		expect(typeof res.headers['x-request-id']).toBe('string');
	});

	it('marks SOAP errors and sets header', async () => {
		const res = await request(makeApp()).get('/soap');
		expect(res.status).toBe(502);
		expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
		expect(res.body?.status).toBe(502);
		expect(res.body?.errorType).toBe('SOAP_ERROR');
		expect(res.headers['x-soap-fault']).toBe('1');
	});
});
