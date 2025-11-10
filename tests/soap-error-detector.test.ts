import { detectSoapError } from '../src/utils/soap-error-detector';

describe('detectSoapError', () => {
  it('returns null for a successful payload', () => {
    const xml = `<?xml version="1.0" encoding="utf-8"?>
    <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
      <SOAP-ENV:Body>
        <lg:BasActionResult xmlns:lg="http://belair-info.com/bas/services">
          <lg:Data>&lt;projects&gt;&lt;object typename="Project"&gt;&lt;param name="id"&gt;1&lt;/param&gt;&lt;/object&gt;&lt;/projects&gt;</lg:Data>
        </lg:BasActionResult>
      </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`;

    expect(detectSoapError(xml)).toBeNull();
  });

  it('detects log entries marked as error', () => {
    const xml = `<?xml version="1.0"?>
    <env:Envelope xmlns:env="http://schemas.xmlsoap.org/soap/envelope/">
      <env:Body>
        <BasActionResult>
          <Logs>
            <Entry severity="ERROR" code="PRJ-001">Dossier invalide</Entry>
          </Logs>
        </BasActionResult>
      </env:Body>
    </env:Envelope>`;

    const detected = detectSoapError(xml);
    expect(detected).not.toBeNull();
    expect(detected?.kind).toBe('log');
    expect(detected?.message).toContain('Dossier invalide');
    expect(detected?.entries?.[0].severity).toBe('ERROR');
    expect(detected?.entries?.[0].code).toBe('PRJ-001');
  });

  it('flags KO status without explicit log entry', () => {
    const xml = `<?xml version="1.0"?>
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <BasActionResult>
          <Status>KO</Status>
          <Message>Le dossier est clos</Message>
        </BasActionResult>
      </soap:Body>
    </soap:Envelope>`;

    const detected = detectSoapError(xml);
    expect(detected).not.toBeNull();
    expect(detected?.kind).toBe('status');
    expect(detected?.message).toContain('Le dossier est clos');
  });

  it('detects textual errors contained in Data', () => {
    const xml = `<?xml version="1.0"?>
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <BasActionResult>
          <Data>Session utilisateur non valide</Data>
        </BasActionResult>
      </soap:Body>
    </soap:Envelope>`;

    const detected = detectSoapError(xml);
    expect(detected).not.toBeNull();
    expect(detected?.kind).toBe('data');
    expect(detected?.message).toContain('Session utilisateur non valide');
  });

  it('parses embedded XML errors encoded in Data', () => {
    const xml = `<?xml version="1.0"?>
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <BasActionResult>
          <Data>&lt;objects&gt;&lt;object typename="Error" severity="ERR" code="QT-999"&gt;&lt;param name="message"&gt;Impossible de creer la quittance&lt;/param&gt;&lt;/object&gt;&lt;/objects&gt;</Data>
        </BasActionResult>
      </soap:Body>
    </soap:Envelope>`;

    const detected = detectSoapError(xml);
    expect(detected).not.toBeNull();
    expect(detected?.kind).toBe('data');
    expect(detected?.message).toContain('Impossible de creer la quittance');
    expect(detected?.entries?.[0].code).toBe('QT-999');
  });
});
