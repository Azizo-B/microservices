import { prisma } from "../../src/data";
import { login, loginAdmin } from "../helpers/login";
import withServer from "../helpers/withServer";

describe("Token REST Layer", () => {
  let request: any;
  let userToken: string;
  let adminToken: string;

  withServer((server) => {
    request = server;
  });

  beforeAll(async () => {
    userToken = await login(request);
    adminToken = await loginAdmin(request);
  });

  describe("POST /api/tokens/sessions", () => {
    it("should log in and return a token for valid credentials", async () => {
      const response = await request
        .post("/api/tokens/sessions")
        .send({
          appId: "507f191e810c19729de860ea",
          email: "test@test.localhost.com",
          password: "test",
        });
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(typeof response.body.token).toBe("string");
    });
  
    it("should return 401 for invalid credentials", async () => {
      const response = await request
        .post("/api/tokens/sessions")
        .send({
          appId: "507f191e810c19729de860ea",
          email: "wrong@test.localhost.com",
          password: "wrongpassword",
        });
  
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "The given email and password do not match.");
    });
  
    it("should return 401 if the email is not verified", async () => {
      const unverifiedUser = await prisma.user.findFirstOrThrow({
        where: {
          email: "test.unverified@test.localhost.com",
          appId: "507f191e810c19729de860ea",
          isVerified: false,
        },
      });
  
      const response = await request
        .post("/api/tokens/sessions")
        .send({
          appId: unverifiedUser.appId,
          email: unverifiedUser.email,
          password: "test",
        });
  
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        "message",
        "Your email address is not verified. Please verify it before logging in.",
      );
    });
  
    it("should return 401 if the account is banned", async () => {
      const bannedUser = await prisma.user.findFirstOrThrow({
        where: {
          email: "banned@test.localhost.com",
          appId: "507f191e810c19729de860ea",
          isVerified: true,
          status: "banned",
        },
      });
  
      const response = await request
        .post("/api/tokens/sessions")
        .send({
          appId: bannedUser.appId,
          email: bannedUser.email,
          password: "test",
        });
  
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        "message",
        "This account has been banned.",
      );
    });
  
    it("should return 401 if the appId is invalid", async () => {
      const response = await request
        .post("/api/tokens/sessions")
        .send({
          appId: "507f191e899c19729de86099",
          email: "test@test.localhost.com",
          password: "test",
        });
  
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        "message",
        "The given email and password do not match.",
      );
    });
  
    it("should return 400 if required fields are missing", async () => {
      const response = await request.post("/api/tokens/sessions").send({
        email: "test@test.localhost.com",
      });
  
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });
  });
  
  describe("GET /api/tokens", () => {
    it("should retrieve all tokens for the logged-in user", async () => {
      const response = await request
        .get("/api/tokens")
        .set("Authorization", userToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("items");
      expect(Array.isArray(response.body.items)).toBe(true);

      response.body.items.forEach((token: any) => {
        expect(token.userId).toEqual("50af191aa10c19729de860ea");
        expect(token).toHaveProperty("id");
        expect(token).toHaveProperty("type");
        expect(token).toHaveProperty("token");
        expect(token).toHaveProperty("createdAt");
        expect(token).toHaveProperty("expiresAt");
        expect(token).toHaveProperty("revokedAt");
        expect(token).toHaveProperty("appId");
      });
    });
  });

  describe("GET /api/tokens/:id", () => {
    it("should retrieve a token by ID", async () => {
      const token = await prisma.token.findFirstOrThrow({
        where: {token: userToken.replace("Bearer ", "")},
      });
      const response = await request
        .get(`/api/tokens/${token.id}`)
        .set("Authorization", userToken);
        
      expect(response.status).toBe(200);
      expect(response.body.userId).toEqual("50af191aa10c19729de860ea");
      expect(response.body).toHaveProperty("id", token.id);
      expect(response.body).toHaveProperty("type");
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("createdAt");
      expect(response.body).toHaveProperty("expiresAt");
      expect(response.body).toHaveProperty("revokedAt");
      expect(response.body).toHaveProperty("appId");
    });

    it("should return 404 for a token ID that does not belong to the logged-in user", async () => {
      const token = await prisma.token.findFirstOrThrow({
        where: {token: adminToken.replace("Bearer ", "")},
      });
      const response = await request
        .get(`/api/tokens/${token.id}`)
        .set("Authorization", userToken);

      expect(response.status).toBe(404);
    });

    it("should return 404 for a non-existent token ID", async () => {
      const response = await request
        .get("/api/tokens/507f191e810c19729de860ff")
        .set("Authorization", userToken);

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/tokens/:id", () => {
    it("should delete a token by ID", async () => {
      const tokenToDelete = await login(request);
      const token = await prisma.token.findFirstOrThrow({
        where: {token: tokenToDelete.replace("Bearer ", "")},
      });
          
      const response = await request
        .delete(`/api/tokens/${token?.id}`)
        .set("Authorization", userToken);

      expect(response.status).toBe(204);

      // Verify token is deleted
      const deletedToken = await prisma.token.findUnique({
        where: { id: token?.id },
      });
      expect(deletedToken?.revokedAt).toBeInstanceOf(Date);
    });

    it("should return 404 for a non-existent token ID", async () => {
      const response = await request
        .delete("/api/tokens/507f191e810c19729de860ff")
        .set("Authorization", userToken);

      expect(response.status).toBe(404);
    });
  });
});
