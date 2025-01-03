import { jwtVerify, SignJWT } from "jose";

export class TokenService {
  private static secret = new TextEncoder().encode(process.env.JWT_SECRET);

  public async verify(token: string): Promise<boolean> {
    try {
      await jwtVerify(token, TokenService.secret);

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
      .sign(TokenService.secret);
  }
}

export const tokenService = new TokenService();
