import { faker } from "@faker-js/faker";
import prisma from "../configs/database";

async function postSeeder() {
    // Post seeding
    await prisma.post.create({
        data: {
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraph(),
            author: {
                connect: {  
                    id: 1
                }
            },
            publishedAt: new Date()
        },
    });
}

export default postSeeder;