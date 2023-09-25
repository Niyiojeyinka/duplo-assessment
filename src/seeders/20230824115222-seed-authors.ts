import { faker } from "@faker-js/faker";
import prisma from "../configs/database";
import { hashPassword } from "../utils/bcrypt";

async function authorSeeder() {
  // Author seeding
  const author1Password = await hashPassword("password");
  await prisma.author.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: author1Password as string
    },
  });
}

export default authorSeeder;