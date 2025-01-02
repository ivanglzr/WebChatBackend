import { jwtVerify, SignJWT, generateSecret, KeyLike } from "jose";

const secretKey = await generateSecret("HS256");

export class TokenService {
  constructor(private secret: KeyLike | Uint8Array<ArrayBufferLike>) {}

  public async verify(token: string): Promise<boolean> {
    try {
      await jwtVerify(token, this.secret);

      return true;
    } catch {
      return false;
    }
  }

  public async sign(payload: Record<string, unknown>): Promise<string> {
    const jwt = new SignJWT(payload);

    return jwt
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer("auth")
      .sign(this.secret);
  }
}

export const tokenService = new TokenService(secretKey);
