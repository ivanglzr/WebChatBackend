import prisma from "./prisma";

import { tokenService } from "./auth/services";

import type { Server } from "socket.io";
import { UUID } from "crypto";

import { IO_EVENTS } from "./config";

export class Io {
  public static io: Server;
}

export function handleSocket(io: Server) {
  Io.io = io;

  Io.io.use(async (socket, next) => {
    if (!socket.handshake.auth.token) {
      socket.disconnect();

      return;
    }

    const payload = await tokenService.verify(socket.handshake.auth.token);

    if (!payload || !payload.id) {
      socket.disconnect();

      return;
    }

    socket.handshake.auth.id = payload.id;

    next();
  });

  Io.io.on("connection", async (socket) => {
    const id = socket.handshake.auth.id as UUID;

    socket.join(IO_EVENTS.USER_ROOM(id));

    const chats = await prisma.chats.findMany({
      where: { usersIds: { has: id } },
    });

    chats.map((chat) => {
      socket.join(IO_EVENTS.CHAT_ROOM(chat.id));
    });

    socket.on(IO_EVENTS.CHAT_CREATED, (chatId) =>
      socket.join(IO_EVENTS.CHAT_ROOM(chatId))
    );

    socket.on("disconnect", () => console.log("user disconnected"));
  });
}
