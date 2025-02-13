import { chatSchema } from "../schemas";

export class ChatValidationService {
  public validateChatData(data: unknown) {
    return chatSchema.safeParse(data);
  }

  public validatePartialChatData(data: unknown) {
    return chatSchema.partial().safeParse(data);
  }

  public validateMemberIds(memberIds: string[]) {
    return chatSchema.pick({ memberIds: true }).safeParse(memberIds);
  }
}

export const chatValidationService = new ChatValidationService();
