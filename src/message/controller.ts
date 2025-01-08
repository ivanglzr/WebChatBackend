import prisma from "@/prisma";
import { PrismaClient } from "@prisma/client";

import type { Request, Response } from "express";

export class MessageController {
  constructor(private prisma: PrismaClient) {}

  public getMessages = async (req: Request, res: Response) => {
    const { id } = req.session;
    const { chatId } = req.params;

    try {
      const chat = await this.prisma.chats.findUnique({
        where: { id: chatId },
      });

      if (!chat) {
        res.status(404).json({
          statusCode: 404,
          message: "Chat not found",
        });

        return;
      }

      if (!chat.usersIds.includes(id)) {
        res.status(404).json({
          statusCode: 404,
          message: "Chat not found",
        });

        return;
      }

      const messages = await this.prisma.messages.findMany({
        where: { chatId },
      });

      if (messages.length === 0) {
        res.status(200).json({
          statusCode: 200,
          message: "There isn't any messages",
        });

        return;
      }

      const message = `Message${messages.length > 1 && "s"} found`;

      res.status(200).json({
        statusCode: 200,
        message,
      });

      return;
    } catch (error) {
      console.error(error);

      res.status(500).json({
        statusCode: 500,
        message: "An error ocurred while fetching the messages",
      });

      return;
    }
  };

  public getMessage = async (req: Request, res: Response) => {
    const { id } = req.session;
    const { chatId, messageId } = req.params;

    try {
      const chat = await this.prisma.chats.findUnique({
        where: { id: chatId },
      });

      if (!chat) {
        res.status(404).json({
          statusCode: 404,
          message: "Chat not found",
        });

        return;
      }

      if (!chat.usersIds.includes(id)) {
        res.status(404).json({
          statusCode: 404,
          message: "Chat not found",
        });

        return;
      }

      const message = await this.prisma.messages.findUnique({
        where: { id: messageId, chatId },
      });

      if (!message) {
        res.status(404).json({
          statusCode: 404,
          message: "Message not found",
        });

        return;
      }

      res.status(200).json({
        statusCode: 200,
        message: "Message found",
      });

      return;
    } catch (error) {
      console.error(error);

      res.status(500).json({
        statusCode: 500,
        message: "An error ocurred while fetching the message",
      });

      return;
    }
  };
}

export const messageController = new MessageController(prisma);
