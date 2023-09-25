import { faker} from "@faker-js/faker";
import { prismaMock } from "../singleton";
import { login, register  } from "../../services/author-service";
import { Author } from "@prisma/client";
import { hashPassword } from "../../utils/bcrypt";
import sinon from "sinon";

describe("authorService", () => {
  const data = {
    id: 1,
    email: faker.internet.email().toLocaleLowerCase(),
    password: faker.internet.password(),
    name: faker.person.fullName(),
  };
  describe("register", () => {
    it("should register a author", async () => {
      prismaMock.author.findUnique.mockResolvedValue(null);
      prismaMock.author.create.mockResolvedValue(data as Author);
      const author = await register(data);

      expect(author).toBeDefined();
      expect(author).toHaveProperty("id");
      expect(author).toHaveProperty("email", data.email);
      expect(author).toHaveProperty("name", data.name);
    });
  });

  describe("login", () => {
    it("should login a author", async () => {
      const hashedPassword = await hashPassword(data.password);
      const result = {
        ...data,
        password: hashedPassword,
      }
      sinon.replace(prismaMock.author, "findUnique", sinon.fake.resolves(result) as any);

      const response = await login(data.email, data.password);
      sinon.restore();

      expect(response).toBeDefined();
      expect(response).toHaveProperty("author");
      expect(response).toHaveProperty("token");
    });  

    it("should return an error if author does not exist", async () => {
      sinon.replace(prismaMock.author, "findUnique", sinon.fake.resolves(null) as any);

      const response = await login(data.email, data.password);
      sinon.restore();

      expect(response).toBeDefined();
      expect(response).toHaveProperty("error");
    });

    it("should return an error if password is invalid", async () => { 
      const hashedPassword = await hashPassword(data.password);
      const result = {
        ...data,
        password: hashedPassword,
      }
      sinon.replace(prismaMock.author, "findUnique", sinon.fake.resolves(result) as any);

      const response = await login(data.email, "invalid password");
      sinon.restore();

      expect(response).toBeDefined();
      expect(response).toHaveProperty("error");
    });
  });
});
