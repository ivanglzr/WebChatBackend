import { messageSchema } from "../schemas";

export class MessageValidationService {
  public validateMessageData(data: unknown) {
    return messageSchema.safeParse(data);
  }
}

export const messageValidationService = new MessageValidationService();
