import prisma from "../configs/database";
import { generateToken } from "../utils";
import { checkPassword, hashPassword } from "../utils/bcrypt";
import { ILoginResponse, ICreateAuthor, IAuthor, IResult  } from "../types/interfaces";

export const register = async (data: ICreateAuthor ) : Promise<IResult<IAuthor>> => {
  const { email, password, name } = data;
  let author = await prisma.author.findUnique({ where: { email } });
  if (author) {
    return {
      success: false,
      error: 'Author already exists'
    }
  }

  const hashedPassword = await hashPassword(password as string);
  author = await prisma.author.create({
    data: {
      email: email.toLocaleLowerCase(),
      password: hashedPassword,
      name
    }
  });

  return {
    success: true,
    data: {
      id: author.id,
      email: author.email,
      name: author.name
    }
  }
}

export const login = async (email: string, password:string) : Promise<IResult<ILoginResponse>> => {
  const errorMessage: string = 'Invalid credentials';
  email = email.toLocaleLowerCase();
  const author = await prisma.author.findUnique({ where: { email } });
  if (!author) {
    return {
      success: false,
      error: errorMessage
    }
  }

  const isMatch = await checkPassword(password, author.password as string);
  if (!isMatch) {
    return {
      success: false,
      error: errorMessage
    }
  }

  const token = generateToken({ authorId: author.id });
  return {
    success: true,
    data: {
      author: {
        id: author.id,
        email: author.email,
        name: author.name
      },
      token
    }
  }
}
