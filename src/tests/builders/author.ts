import { faker } from "@faker-js/faker";
import { generateToken } from "../../utils";
import { hashPassword } from "../../utils/bcrypt";
import { Author } from "@prisma/client";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const buildAuthor = async (data: Author | null = null): Promise<Author> => {
  const hashedPassword = await hashPassword("password");
  const email = data?.email || faker.internet.email()
  const author = await prisma.author.create(
    { 
      data: {
      email: email.toLocaleLowerCase(),
      name: data?.name || faker.person.firstName(),
      password: hashedPassword as string,
    }
  });

  return author;
}

const buildAuth = async (author: Author | null = null): Promise<any> => {
  if (!author) {
    author = await buildAuthor();
  }

  const token = generateToken({ authorId: author.id });
  return {
    author, token
  }
}


export { buildAuth, buildAuthor };