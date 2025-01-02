import argon2 from "argon2";

export class PasswordService {
  public async hash(password: string): Promise<string> {
    return argon2.hash(password);
  }

  public async verify(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}

export const passwordService = new PasswordService();
