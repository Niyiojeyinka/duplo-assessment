import { generateToken, verifyToken } from "../../utils";

describe('JWT', () => {
  const payload = { authorId: 1 };
  const token = generateToken(payload);
  const decodedToken = verifyToken(token);

  it('should generate a token', () => {
    expect(token).toBeDefined();
  });

  it('should decode a token', () => {
    expect(decodedToken).toBeDefined();
    expect(decodedToken.authorId).toBe(1);
  });

  it('should throw an error if token is invalid', () => {
    expect(() => verifyToken('invalid token')).toThrow();
  });
});
