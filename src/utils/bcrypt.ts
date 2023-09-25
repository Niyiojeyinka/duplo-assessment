import bcrypt from "bcryptjs"
import { IErrorResponse } from "../types/interfaces";
import logger from "../configs/logger";

const saltRounds = 10

const hashPassword = async (password: string) : Promise<string | IErrorResponse> => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    logger.error(error);
    return {
      error: "Unexpected error occurred."
    }
  }
}

const checkPassword = async (password:string, hashedPassword: string) : Promise<boolean> => {
  try {
      const result = await bcrypt.compare(password, hashedPassword);
      return result; 
  } catch (error) {
      logger.error(error);
      return false
  }
}

export {
  hashPassword,
  checkPassword
}