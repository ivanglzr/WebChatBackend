import prisma from "./prisma";

import { tokenService } from "./auth/services";

import type { Server } from "socket.io";
import { UUID } from "crypto";

import { EVENTS } from "./config";

export function handleSocket(io: Server) {
  io.use(async (socket, next) => {
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

  io.on("connection", async (socket) => {
    const id = socket.handshake.auth.id as UUID;

    const chats = await prisma.chats.findMany({
      where: { usersIds: { has: id } },
    });

    const rooms = chats.map(({ id: chatId }) => EVENTS.CHAT_ROOM(chatId));

    rooms.push(EVENTS.USER_ROOM(id));

    socket.join(rooms);

    socket.on(EVENTS.CHAT_DELETED, (chatId) => {
      socket.leave(EVENTS.CHAT_ROOM(chatId));
    });

    socket.on("test", (id) => {
      console.log(id);
    });

    socket.on("message", (msg) => {
      io.emit("message", msg);
    });

    socket.on("disconnect", () => console.log("user disconnected"));
  });
}
