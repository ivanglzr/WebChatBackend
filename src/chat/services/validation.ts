import { chatSchema } from "../schemas";

export class ChatValidationService {
  public validateChatData(data: unknown) {
    return chatSchema.safeParse(data);
  }
}

export const chatValidationService = new ChatValidationService();
