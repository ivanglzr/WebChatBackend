import prisma from "@/prisma";
import { PrismaClient } from "@prisma/client";

import { socketServer } from "@/io";

import { messageValidationService } from "./services/validation";

import { EVENTS } from "@/config";

import type { Request, Response } from "express";

export class MessageController {
  constructor(private prisma: PrismaClient) {}

  public getMessages = async (req: Request, res: Response) => {
    const { id } = req.session;
    const { chatId } = req.params;

    try {
      const chat = await this.prisma.chat.findUnique({
        where: { id: chatId },
      });

      if (!chat) {
        res.status(404).json({
          statusCode: 404,
          message: "Chat not found",
        });

        return;
      }

      if (!chat.memberIds.includes(id)) {
        res.status(404).json({
          statusCode: 404,
          message: "Chat not found",
        });

        return;
      }

      const messages = await this.prisma.message.findMany({
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
        data: messages,
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
      const chat = await this.prisma.chat.findUnique({
        where: { id: chatId },
      });

      if (!chat) {
        res.status(404).json({
          statusCode: 404,
          message: "Chat not found",
        });

        return;
      }

      if (!chat.memberIds.includes(id)) {
        res.status(404).json({
          statusCode: 404,
          message: "Chat not found",
        });

        return;
      }

      const message = await this.prisma.message.findUnique({
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
        message: "Message found successfully",
        data: message,
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

  public postMessage = async (req: Request, res: Response) => {
    const { data, error } = messageValidationService.validateMessageData(
      req.body
    );

    if (error) {
      res.status(422).json({
        statusCode: 422,
        message: error.errors[0].message,
      });

      return;
    }

    const { id } = req.session;
    const { chatId } = req.params;

    try {
      const message = await this.prisma.message.create({
        data: {
          content: data.content,
          chatId,
          ownerId: id,
        },
      });

      socketServer
        .getIo()
        .to(EVENTS.CHAT_ROOM(chatId))
        .emit(EVENTS.MESSAGE_CREATED, message);

      res.status(200).json({
        statusCode: 200,
        message: "Message created successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        statusCode: 500,
        message: "An error ocurred while creating the message",
      });
    }
  };

  public putMessage = async (req: Request, res: Response) => {
    const { data, error } = messageValidationService.validateMessageData(
      req.body
    );

    if (error) {
      res.status(422).json({
        statusCode: 422,
        message: "Message is not valid",
      });

      return;
    }

    const { id } = req.session;
    const { chatId, messageId } = req.params;

    const filter = {
      id: messageId,
      chatId,
      userId: id,
    };

    try {
      const message = await this.prisma.message.findFirst({
        where: filter,
      });

      if (!message) {
        res.status(404).json({
          statusCode: 404,
          message: "Message not found",
        });

        return;
      }

      await this.prisma.message.update({ where: filter, data });

      res.status(200).json({
        statusCode: 200,
        message: "Message edited successfully",
      });

      return;
    } catch (error) {
      console.error(error);

      res.status(500).json({
        statusCode: 500,
        message: "An error ocurred while editing the message",
      });

      return;
    }
  };

  public deleteMessage = async (req: Request, res: Response) => {
    const { id } = req.session;
    const { chatId, messageId } = req.params;

    const filter = {
      id: messageId,
      chatId,
      userId: id,
    };

    try {
      const message = await this.prisma.message.findFirst({ where: filter });

      if (!message) {
        res.status(404).json({
          statusCode: 404,
          message: "Message not found",
        });

        return;
      }

      await this.prisma.message.delete({ where: filter });

      res.status(200).json({
        statusCode: 200,
        message: "Message deleted successfully",
      });

      return;
    } catch (error) {
      console.error(error);

      res.status(500).json({
        statusCode: 500,
        message: "An error ocurred while deleting the message",
      });
    }
  };
}

export const messageController = new MessageController(prisma);
