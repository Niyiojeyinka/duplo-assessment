import prisma from "../configs/database";
import { generateToken, isError } from "../utils";
import { checkPassword, hashPassword } from "../utils/bcrypt";
import { IErrorResponse, ILoginResponse, ICreateAuthor, IAuthor  } from "../types/interfaces";

export const register = async (data: ICreateAuthor ) : Promise<IErrorResponse | IAuthor > => {
  const { email, password, name } = data;
  let author = await prisma.author.findUnique({ where: { email } });
  if (author) {
    return {
      error: 'Author already exists'
    }
  }

  const hashedPassword = await hashPassword(password as string);
  if (isError(hashedPassword)){
    return hashedPassword;
  } 
  
  author = await prisma.author.create({
    data: {
      email: email.toLocaleLowerCase(),
      password: hashedPassword,
      name
    }
  });

  return {
    id: author.id,
    email: author.email.toLocaleLowerCase(),
    name: author.name
  };
}

export const login = async (email: string, password:string) : Promise<IErrorResponse | ILoginResponse> => {
  const errorMessage: string = 'Invalid credentials';
  email = email.toLocaleLowerCase();
  const author = await prisma.author.findUnique({ where: { email } });
  if (!author) {
    return {
      error: errorMessage
    }
  }

  const isMatch = await checkPassword(password, author.password as string);
  if (!isMatch) {
    return {
      error: errorMessage
    }
  }

  const token = generateToken({ authorId: author.id });
  return {
    author: {
      id: author.id,
      email: author.email,
      name: author.name
    },
    token
  }
}
