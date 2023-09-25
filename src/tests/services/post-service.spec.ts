import { faker} from "@faker-js/faker";
import { prismaMock } from "../singleton";
import { createPost, getPost, getPosts,
  updatePost, deletePost } from "../../services/post-service";
import { Post } from "@prisma/client";
import { buildAuthor } from "../builders/author";
import { IErrorResponse } from "../../types/interfaces";


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
      const post = await createPost(data);

      expect(post).toBeDefined();
      expect(post).toHaveProperty("id");
      expect(post).toHaveProperty("title", data.title);
      expect(post).toHaveProperty("content", data.content);
      expect(post).toHaveProperty("authorId", data.authorId);
    });
  });

  describe("getPost", () => {
    it("should get a post", async () => {
      prismaMock.post.findUnique.mockResolvedValue(data as Post);
      const post = await getPost(data.id);

      expect(post).toBeDefined();
      expect(post).toHaveProperty("id");
      expect(post).toHaveProperty("title", data.title);
      expect(post).toHaveProperty("content", data.content);
    });
  });

  describe("getPosts", () => {
    it("should get posts", async () => {
      prismaMock.post.findMany.mockResolvedValue([data] as Post[]);
      prismaMock.post.count.mockResolvedValue(1);
      const posts = await getPosts({ skip: 0, take: 10 });

      expect(posts).toBeDefined();
      expect(posts).toHaveProperty("data");
      expect(posts).toHaveProperty("total");
      expect(posts).toHaveProperty("totalPages");
      expect(posts).toHaveProperty("currentPage");
      expect(posts).toHaveProperty("nextPage");
    });
  });

  describe("updatePost", () => {
    it("should update a post", async () => {
      const updatedData = {
        title: faker.lorem.words(3),
        content: faker.lorem.paragraph(),
      };
      prismaMock.post.update.mockResolvedValue({ ...data, ...updatedData } as Post);
      const post = await updatePost(data.id, updatedData);

      expect(post).toBeDefined();
      expect(post).toHaveProperty("id");
      expect(post).toHaveProperty("title", updatedData.title);
      expect(post).toHaveProperty("content", updatedData.content);
    });

    it("should not update a post if author is not the owner", async () => {
      const updatedData = {
        title: faker.lorem.words(3),
        content: faker.lorem.paragraph(),
      };
      const author = await buildAuthor();
      
      prismaMock.post.update.mockResolvedValue({
        ...data, authorId: 100,
      } as Post);
      const response = await updatePost(data.id, {
        content: updatedData.content,
        title: updatedData.title,
        author
      }) as IErrorResponse;

      expect(response).toHaveProperty("error");
      expect(response.error).toBe("Not authorized");
    });

    it("should not update a post if post is not found", async () => {
      const updatedData = {
        title: faker.lorem.words(3),
        content: faker.lorem.paragraph(),
      };
      prismaMock.post.update.mockRejectedValue({ code: 'P2025'});
      const response = await updatePost(500, updatedData) as IErrorResponse;

      expect(response).toHaveProperty("error");
      expect(response.error).toBe("Post not found");
    });
  });

  describe("deletePost", () => {
    it("should delete a post", async () => {
      const author = await buildAuthor();
      prismaMock.post.delete.mockResolvedValue(data as Post);
      const response = await deletePost(data.id, author);

      expect(response).toBe("Post deleted");
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
