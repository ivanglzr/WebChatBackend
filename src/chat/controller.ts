import prisma from "@/prisma";

import { PrismaClient } from "@prisma/client";

import { chatValidationService } from "./services/validation";

import type { Request, Response } from "express";

export class ChatController {
  constructor(private prisma: PrismaClient) {}

  public getUserChats = async (req: Request, res: Response) => {
    const { id } = req.session;

    try {
      const chats = await this.prisma.chat.findMany({
        where: { ownerId: id },
      });

      const message =
        chats.length === 0
          ? "No chats found"
          : `Chat${chats.length > 1 && "s"} fetched successfully`;

      res.status(200).json({
        statusCode: 200,
        message,
        data: chats,
      });

      return;
    } catch (error) {
      console.error(error);

      res.status(500).json({
        statusCode: 500,
        message: "An error ocurred while fetching the chats",
      });

      return;
    }
  };

  public getChatById = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const { id } = req.session;

    try {
      const chat = await this.prisma.chat.findUnique({
        where: {
          ownerId: id,
          id: chatId,
        },
      });

      if (!chat) {
        res.status(404).json({
          statusCode: 404,
          message: "Chat not found",
        });

        return;
      }

      res.status(200).json({
        statusCode: 200,
        message: "Chat fetched successfully",
        data: chat,
      });

      return;
    } catch (error) {
      console.error(error);

      res.status(500).json({
        statusCode: 500,
        message: "An error ocurred while fetching the chat",
      });

      return;
    }
  };

  public createChat = async (req: Request, res: Response) => {
    const { data, error } = chatValidationService.validateChatData(req.body);

    if (error) {
      res.status(422).json({
        statusCode: 422,
        message: error.errors[0].message,
      });

      return;
    }

    const { id } = req.session;

    if (!data.usersIds.includes(id)) data.usersIds.push(id);

    try {
      await this.prisma.chat.create({
        data: { ...data, ownerId: id },
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

  public editChat = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const { id } = req.session;

    const { data, error } = chatValidationService.validatePartialChatData(
      req.body
    );

    if (error) {
      res.status(422).json({
        statusCode: 422,
        message: error.errors[0].message,
      });

      return;
    }

    if (Object.keys(data).length === 0) {
      res.status(200).json({
        statusCode: 200,
        message: "Chat updated successfully",
      });

      return;
    }

    try {
      const chat = await this.prisma.chat.updateMany({
        where: {
          id: chatId,
          ownerId: id,
        },
        data,
      });

      if (chat.count === 0) {
        res.status(404).json({
          statusCode: 404,
          message: "Chat not found",
        });

        return;
      }

      res.status(200).json({
        statusCode: 200,
        message: "Chat updated successfully",
      });

      return;
    } catch (error) {
      console.error(error);

      res.status(500).json({
        statusCode: 500,
        message: "An error ocurred while updating the chat",
      });

      return;
    }
  };

  public deleteChat = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const { id } = req.session;

    try {
      const chat = await this.prisma.chat.findFirst({
        where: {
          id: chatId,
          ownerId: id,
        },
      });

      if (!chat) {
        res.status(404).json({
          statusCode: 404,
          message: "Chat not found",
        });

        return;
      }

      await this.prisma.chat.delete({ where: { id: chatId, ownerId: id } });

      res.status(200).json({
        statusCode: 200,
        message: "Chat deleted successfully",
      });

      return;
    } catch (error) {
      console.error(error);

      res.status(500).json({
        statusCode: 500,
        message: "An error ocurred while deleting the chat",
      });

      return;
    }
  };
}

export const chatController = new ChatController(prisma);
