import prisma from "@/prisma";

import { PrismaClient } from "@prisma/client";

import { passwordService } from "./services/password";

import { tokenService, authValidationService } from "./services";

import type { Request, Response } from "express";

import { authCookieName, cookieOptions } from "./config";

export class AuthController {
  constructor(private prisma: PrismaClient) {}

  private async userExists(email: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email },
      });

      return !user ? false : true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  public logIn = async (req: Request, res: Response) => {
    const { data, error } = authValidationService.validateLogInData(req.body);

    if (error) {
      res.status(422).json({
        statusCode: 422,
        message: error.errors[0].message,
      });

      return;
    }

    try {
      const user = await this.prisma.user.findFirst({
        where: { email: data.email },
      });

      if (!user) {
        res.status(404).json({ statusCode: 404, message: "User not found" });

        return;
      }

      const isPasswordValid = await passwordService.verify(
        user.password,
        data.password
      );

      if (!isPasswordValid) {
        res.status(401).json({ statusCode: 401, message: "Log in denied" });

        return;
      }

      const accessToken = await tokenService.sign({ id: user.id });

      res.cookie(authCookieName, accessToken, cookieOptions);

      res.status(200).json({ statusCode: 200, message: "Log in successful" });

      return;
    } catch (error) {
      console.error(error);

      res.status(500).json({
        statusCode: 500,
        message: "An error ocurred while validating the log in",
      });

      return;
    }
  };

  public register = async (req: Request, res: Response) => {
    const { data, error } = authValidationService.validateRegisterData(
      req.body
    );

    if (error) {
      res.status(422).json({
        statusCode: 422,
        message: error.errors[0].message,
      });

      return;
    }

    try {
      const userExists = await this.userExists(data.email);

      if (userExists) {
        res
          .status(409)
          .json({ statusCode: 409, message: "User already exists" });

        return;
      }

      const hassedPassword = await passwordService.hash(data.password);

      const user = await this.prisma.user.create({
        data: { ...data, password: hassedPassword },
      });

      const accessToken = await tokenService.sign({ id: user.id });

      res.cookie(authCookieName, accessToken, cookieOptions);

      res
        .status(201)
        .json({ statusCode: 201, message: "User created successfully" });

      return;
    } catch (error) {
      console.error(error);

      res.status(500).json({
        statusCode: 500,
        message: "An error ocurred while creating the user",
      });

      return;
    }
  };
}

export const authController = new AuthController(prisma);
