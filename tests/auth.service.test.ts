import AuthService from '../src/auth/auth.service';

const TEST_SECRET = 'dev-secret-test-123';
const SID = 'session-xyz';

describe('AuthService', () => {
  const auth = new AuthService({ defaultTtlSeconds: 5 });

  it('creates a compact JWT with three segments', async () => {
    const token = await auth.get_token(TEST_SECRET, SID);
    expect(token.split('.')).toHaveLength(3);
  });

  it('verifies and extracts SID with key', async () => {
    const token = await auth.get_token(TEST_SECRET, SID);
    const result = await auth.get_SID(token, TEST_SECRET);
    expect(result).toBe(SID);
  });

  it('decodes SID without verification when no key provided', async () => {
    const token = await auth.get_token(TEST_SECRET, SID);
    const result = await auth.get_SID(token);
    expect(result).toBe(SID);
  });

  it('returns null for invalid token format', async () => {
    const result = await auth.get_SID('not-a-jwt');
    expect(result).toBeNull();
  });

  it('returns null when key is wrong', async () => {
    const token = await auth.get_token(TEST_SECRET, SID);
    const result = await auth.get_SID(token, 'wrong-key');
    expect(result).toBeNull();
  });

  it('returns null for tampered token', async () => {
    const token = await auth.get_token(TEST_SECRET, SID);
    const parts = token.split('.');
    // Corrupt payload
    parts[1] = parts[1].replace(/.$/, parts[1].slice(-1) === 'A' ? 'B' : 'A');
    const tampered = parts.join('.');
    const result = await auth.get_SID(tampered, TEST_SECRET);
    expect(result).toBeNull();
  });
});
