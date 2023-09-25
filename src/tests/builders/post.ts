import { faker } from "@faker-js/faker";
import { Post, Author } from "@prisma/client";
import { PrismaClient } from '@prisma/client';
import { buildAuthor } from "./author";

const prisma = new PrismaClient();

const buildPost = async (data: Post | null = null, author: Author | null = null): Promise<Post> => {
  if (!author) {
  author = await buildAuthor();
  }

  const post = await prisma.post.create(
    { 
      data: {
      title: data?.title || faker.lorem.sentence(),
      content: data?.content || faker.lorem.paragraph(),
      publishedAt: new Date(),
      author: {
        connect: {
          id: author?.id
        }
      },
    }
  });

  return post;
}

export { buildPost };