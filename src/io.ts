import prisma from "./prisma";

import { tokenService } from "./auth/services";

import type { Server } from "socket.io";
import type { UUID } from "crypto";

import { EVENTS } from "./config";

class SocketServer {
  private io!: Server;

  init(server: Server) {
    this.io = server;

    this.io.use(async (socket, next) => {
      if (!socket.handshake.auth.token) {
        socket.disconnect();

        next(new Error("Connection not authorized"));

        return;
      }

      const payload = await tokenService.verify(socket.handshake.auth.token);

      if (!payload || !payload.id) {
        socket.disconnect();

        next(new Error("Connection not authorized"));

        return;
      }

      socket.handshake.auth.id = payload.id;

      next();
    });

    this.io.on("connection", async (socket) => {
      const id = socket.handshake.auth.id as UUID;

      const chats = await prisma.chat.findMany({
        where: { usersIds: { has: id } },
      });

      const rooms = chats.map(({ id: chatId }) => EVENTS.CHAT_ROOM(chatId));

      rooms.push(EVENTS.USER_ROOM(id));

      socket.join(rooms);

      socket.on(EVENTS.CHAT_DELETED, (chatId) => {
        socket.leave(EVENTS.CHAT_ROOM(chatId));
      });
    });
  }

  getIo() {
    return this.io;
  }
}

export const socketServer = new SocketServer();
