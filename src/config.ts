export const EVENTS = {
  CHAT_ROOM: (chatId: string) => `Chat ${chatId}`,
  USER_ROOM: (userId: string) => `User ${userId}`,
  CHAT_CREATED: "Chat created",
  CHAT_DELETED: "Chat deleted",
  MESSAGE_CREATED: "Message created",
};
