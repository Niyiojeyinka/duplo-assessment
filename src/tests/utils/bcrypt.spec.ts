import { hashPassword, checkPassword } from '../../utils/bcrypt';

describe('Bcrypt', () => {
  const password = 'password';
 
  it('should hash a password', async () => {
    const hashedPassword: string  = await hashPassword(password);

    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toBe(password);
  });

  it('should compare a password', async () => {
    const hashedPassword: string = await hashPassword(password);

    expect(await checkPassword(password, hashedPassword as string)).toBe(true);
  });

  it('should return false if password is invalid', async () => {
    const hashedPassword: string = await hashPassword(password);

    expect(await checkPassword('invalid password', hashedPassword as string)).toBe(false);
  });
});
