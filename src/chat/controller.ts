import prisma from "@/prisma";

import { PrismaClient } from "@prisma/client";

import { chatValidationService } from "./services/validation";

import type { Request, Response } from "express";

export class ChatController {
  constructor(private prisma: PrismaClient) {}

  public createChat = async (req: Request, res: Response) => {
    const { data, error } = chatValidationService.validateChatData(req.body);

    if (error) {
      res.status(422).json({
        statusCode: 422,
        message: error.errors[0].message,
      });

      return;
    }

    try {
      await this.prisma.chats.create({
        data,
      });

      res.status(201).json({
        statusCode: 201,
        message: "Chat created successfully",
      });

      return;
    } catch (error) {
      console.error(error);

      res.status(500).json({
        statusCode: 500,
        message: "An error ocurred while creating the chat",
      });

      return;
    }
  };
}

export const chatController = new ChatController(prisma);
