import { faker} from "@faker-js/faker";
import { prismaMock } from "../singleton";
import { createPost, getPost, getPosts,
  updatePost, deletePost } from "../../services/post-service";
import { Post } from "@prisma/client";
import { buildAuthor } from "../builders/author";
import { IPost, IResult } from "../../types/interfaces";


describe("postService",  () => {
  const data = {
    id: 1,
    title: faker.lorem.words(3),
    content: faker.lorem.paragraph(),
    authorId: 1,
    status: 'PUBLISHED',
    publishedAt: new Date(),
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  describe("createPost", () => {
    it("should create a post", async () => {
      prismaMock.post.create.mockResolvedValue(data as Post);
      const result = await createPost(data);

      expect(result).toBeDefined();
      expect(result).toHaveProperty("data");
      expect(result.data).toHaveProperty("id");
      expect(result.data).toHaveProperty("title", data.title);
      expect(result.data).toHaveProperty("content", data.content);
    });
  });

  describe("getPost", () => {
    it("should get a post", async () => {
      prismaMock.post.findUnique.mockResolvedValue(data as Post);
      const result = await getPost(data.id);

      expect(result).toBeDefined();
      expect(result).toHaveProperty("data");
      expect(result.data).toHaveProperty("id");
      expect(result.data).toHaveProperty("title", data.title);
      expect(result.data).toHaveProperty("content", data.content);

    });
  });

  describe("getPosts", () => {
    it("should get posts", async () => {
      prismaMock.post.findMany.mockResolvedValue([data] as Post[]);
      prismaMock.post.count.mockResolvedValue(1);
      const result = await getPosts({ skip: 0, take: 10 });

      expect(result).toBeDefined();
      expect(result).toHaveProperty("data");
      expect(result['data']).toHaveProperty("items");
      expect(result['data']).toHaveProperty("total");
      expect(result['data']).toHaveProperty("totalPages");
      expect(result['data']).toHaveProperty("currentPage");
      expect(result['data']).toHaveProperty("nextPage");
    });
  });

  describe("updatePost", () => {
    it("should update a post", async () => {
      const updatedData = {
        title: faker.lorem.words(3),
        content: faker.lorem.paragraph(),
      };
      prismaMock.post.findUnique.mockResolvedValue(data as Post);
      prismaMock.post.update.mockResolvedValue({ ...data, ...updatedData } as Post);
      const result = await updatePost(data.id, updatedData);

      expect(result).toBeDefined();
      expect(result).toHaveProperty("data");
      expect(result.data).toHaveProperty("id");
      expect(result.data).toHaveProperty("title", updatedData.title);
      expect(result.data).toHaveProperty("content", updatedData.content);    
    });

    it("should not update a post if author is not the owner", async () => {
      const updatedData = {
        title: faker.lorem.words(3),
        content: faker.lorem.paragraph(),
      };
      const author = await buildAuthor();
      
      prismaMock.post.findUnique.mockResolvedValue(data as Post);
      prismaMock.post.update.mockResolvedValue({
        ...data, authorId: 100,
      } as Post);
      const response = await updatePost(data.id, {
        content: updatedData.content,
        title: updatedData.title,
        author
      }) as IResult<IPost>;

      expect(response).toHaveProperty("error");
      expect(response.error).toBe("Not authorized");
    });

    it("should not update a post if post is not found", async () => {
      const updatedData = {
        title: faker.lorem.words(3),
        content: faker.lorem.paragraph(),
      };
      prismaMock.post.update.mockRejectedValue({ code: 'P2025'});
      const response = await updatePost(500, updatedData) as IResult<IPost>;

      expect(response).toHaveProperty("error");
      expect(response.error).toBe("Post not found");
    });
  });

  describe("deletePost", () => {
    it("should delete a post", async () => {
      const author = await buildAuthor();
      prismaMock.post.delete.mockResolvedValue(data as Post);
      const response = await deletePost(data.id, author);

      expect(response).toBeDefined();
      expect(response).toHaveProperty("data");
      expect(response.data).toHaveProperty("message", "Post deleted successfully");
    });

    it("should not delete a post if post is not found", async () => {
      const author = await buildAuthor();
      prismaMock.post.delete.mockRejectedValue({});
      const response = await deletePost(data.id, author);

      expect(response).toHaveProperty("error");
    });

    it("should not delete a post if author is not the owner", async () => {
      const author = await buildAuthor();
      prismaMock.post.delete.mockRejectedValue({ authorId: 100 });
      const response = await deletePost(data.id, author);

      expect(response).toHaveProperty("error");
    });
  });
});
