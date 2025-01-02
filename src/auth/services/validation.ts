import { logInSchema, registerSchema } from "../schemas";

export class AuthValidationService {
  public validateLogInData(data: unknown) {
    return logInSchema.safeParse(data);
  }

  public validateRegisterData(data: unknown) {
    return registerSchema.safeParse(data);
  }
}

export const authValidationService = new AuthValidationService();
