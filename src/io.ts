import type { Server } from "socket.io";

export default function handleSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("message", (msg) => io.emit("message", msg));
  });
}
