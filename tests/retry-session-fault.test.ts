import request from 'supertest';
import nock from 'nock';
import AuthService from '../src/auth/auth.service';

// We'll import the app after setting envs/mocks

describe('SOAP retry on session-not-found (mocked)', () => {
  beforeAll(() => {
    // Point AppConfigService to a deterministic host via env-driven config
    process.env.SOAP_BASE_URL = 'http://ec2-13-39-84-162.eu-west-3.compute.amazonaws.com';
    process.env.SOAP_PORT = '8080';
    process.env.SOAP_API_PATH = '/soap/';
    process.env.SOAP_ACTION_SERVICE = 'IBasActionService';
    process.env.SOAP_AUTH_SERVICE = 'IBasAuthService';
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('retries once after openSession and succeeds', async () => {
  // Arrange: base host must match AppConfigService env settings
  const host = `${process.env.SOAP_BASE_URL}:${process.env.SOAP_PORT}`;

    // 1) Mock OpenSession to return a valid BasSecurityContext
    const openSessionResponse = `<?xml version="1.0" encoding="utf-8"?>
    <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:lg="http://belair-info.com/bas/services">
      <SOAP-ENV:Body>
        <lg:BasSecurityContext>
          <SessionId>SID-REOPENED</SessionId>
          <IsAuthenticated>true</IsAuthenticated>
        </lg:BasSecurityContext>
      </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`;

    nock(host)
      .post('/soap/IBasAuthService')
      .times(1)
      .reply(200, openSessionResponse, { 'Content-Type': 'text/xml' });

    // 2) First RunAction call -> SOAP Fault "session not found"
    const sessionFault = `<?xml version="1.0"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Body><SOAP-ENV:Fault><faultcode>SOAP-ENV:Client</faultcode><faultstring>Session not found</faultstring><detail><state>0</state></detail></SOAP-ENV:Fault></SOAP-ENV:Body></SOAP-ENV:Envelope>`;

    nock(host)
      .post('/soap/IBasActionService')
      .once()
      .reply(200, sessionFault, { 'Content-Type': 'text/xml' });

    // 3) Second RunAction call -> success envelope with Data
    const successRunAction = `<?xml version="1.0"?>
    <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:lg="http://belair-info.com/bas/services">
      <SOAP-ENV:Body>
        <lg:BasActionResult>
          <Data>&lt;projects&gt;&lt;object typename=\"Project\"&gt;&lt;param name=\"id\" int_val=\"1\" /&gt;&lt;/object&gt;&lt;/projects&gt;</Data>
        </lg:BasActionResult>
      </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`;

    nock(host)
      .post('/soap/IBasActionService')
      .reply(200, successRunAction, { 'Content-Type': 'text/xml' });

  // Prepare a valid token so authMiddleware passes and provides req.user.sub
  const SECRET = 'test-secret-key-1234567890-RETRY';
  process.env.JWS_KEY = SECRET;
  const auth = new AuthService();
  const token = await auth.get_token(SECRET, 'SID-RETRY-TEST');

  const app = (await import('../src/server')).default;

    // Act
    const res = await request(app)
      .post('/api/projects/project_listitems')
  .set('Authorization', `Bearer ${token}`)
      .send({ dossier: 123, domain: 'test-domain' });

    // Assert
    if (res.status !== 200) {
      // Debug output to understand failure
      // eslint-disable-next-line no-console
      console.error('Retry test failed with status', res.status, 'body:', res.text);
    }
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });
});
