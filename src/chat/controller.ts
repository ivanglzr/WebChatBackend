import prisma from "@/prisma";

import { PrismaClient } from "@prisma/client";

import { chatValidationService } from "./services/validation";

import type { Request, Response } from "express";

export class ChatController {
  constructor(private prisma: PrismaClient) {}

  public getUserChats = async (req: Request, res: Response) => {
    const { id } = req.session;

    try {
      const chats = await this.prisma.chats.findMany({
        where: { ownerId: id },
      });

      const message =
        chats.length === 0
          ? "No chats found"
          : `Chat${chats.length > 1 && "s"} fetched successfully`;

      res.status(200).json({
        statusCode: 200,
        message,
        chats,
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
      await this.prisma.chats.create({
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
}

export const chatController = new ChatController(prisma);
