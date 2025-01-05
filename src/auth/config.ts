import { CookieOptions } from "express";

export const authCookieName = "access_token";

export const cookieOptions: CookieOptions = {
  expires: new Date(Date.now() + 1000 * 60 * 60),
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};
