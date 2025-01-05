import prisma from "./prisma";

import { tokenService } from "./auth/services";

import type { Server } from "socket.io";
import { UUID } from "crypto";

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

    socket.join(`User ${id}`);

    const chats = await prisma.chats.findMany({
      where: { usersIds: { has: id } },
    });

    chats.map((chat) => {
      socket.join(`Chat ${chat.id}`);
    });

    socket.on("disconnect", () => console.log("user disconnected"));
  });
}
