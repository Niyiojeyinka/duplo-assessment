import bcrypt from "bcryptjs"
import logger from "../configs/logger";

const saltRounds = 10

const hashPassword = async (password: string) : Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword; 
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