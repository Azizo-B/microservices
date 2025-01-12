import { prisma } from "../../src/data";
import { login, loginAdmin } from "../helpers/login";
import withServer from "../helpers/withServer";

let request: any;
let userToken: string;
let adminToken: string;

withServer((supertest) => {
  request = supertest;
});

describe("Application REST", () => {

  beforeAll(async () => {
    userToken = await login(request);
    adminToken = await loginAdmin(request);
  });

  describe("POST /api/applications", () => {
    it("should allow admin to create a new application", async () => {
      const response = await request
        .post("/api/applications")
        .set("Authorization", adminToken)
        .send({ name: "New Application" });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({ name: "New Application" });
    });

    it("should return 403 for regular users", async () => {
      const response = await request
        .post("/api/applications")
        .set("Authorization", userToken)
        .send({ name: "Unauthorized Application" });

      expect(response.status).toBe(403);
    });

    it("should return 400 for invalid input", async () => {
      const response = await request
        .post("/api/applications")
        .set("Authorization", adminToken)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET /api/applications", () => {
    it("should retrieve all applications", async () => {
      const response = await request.get("/api/applications");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("items");
      expect(Array.isArray(response.body.items)).toBe(true);

      response.body.items.forEach((application: any) => {
        expect(application).toHaveProperty("id");
        expect(application).toHaveProperty("name");
      });
    });
  });

  describe("GET /api/applications/:id", () => {
    it("should retrieve an application by ID", async () => {
      const newAppResponse = await request
        .post("/api/applications")
        .set("Authorization", adminToken)
        .send({ name: "Specific Application" });

      const appId = newAppResponse.body.id;
      const response = await request.get(`/api/applications/${appId}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ id: appId, name: "Specific Application" });
    });

    it("should return 404 for non-existent application", async () => {
      const response = await request.get("/api/applications/507f191e810c19729de860eb");

      expect(response.status).toBe(404);
    });
  });

  describe("PATCH /api/applications/:id", () => {
    it("should allow admin to update an application", async () => {
      const newAppResponse = await request
        .post("/api/applications")
        .set("Authorization", adminToken)
        .send({ name: "Updatable Application" });

      const appId = newAppResponse.body.id;
      const response = await request
        .patch(`/api/applications/${appId}`)
        .set("Authorization", adminToken)
        .send({ name: "Updated Application" });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ id: appId, name: "Updated Application" });
    });

    it("should return 403 for regular users", async () => {
      const newAppResponse = await request
        .post("/api/applications")
        .set("Authorization", adminToken)
        .send({ name: "Non-updatable Application" });

      const appId = newAppResponse.body.id;
      const response = await request
        .patch(`/api/applications/${appId}`)
        .set("Authorization", userToken)
        .send({ name: "Unauthorized Update" });

      expect(response.status).toBe(403);
    });
  });

  describe("DELETE /api/applications/:id", () => {
    it("should allow admin to delete an application", async () => {
      const newAppResponse = await request
        .post("/api/applications")
        .set("Authorization", adminToken)
        .send({ name: "Deletable Application" });

      const appId = newAppResponse.body.id;
      const response = await request
        .delete(`/api/applications/${appId}`)
        .set("Authorization", adminToken);

      expect(response.status).toBe(204);
      const deletedApp = await prisma.application.findFirst({where: {id: appId}});
      expect(deletedApp).toBeNull();
    });

    it("should return 403 for regular users", async () => {
      const newAppResponse = await request
        .post("/api/applications")
        .set("Authorization", adminToken)
        .send({ name: "Non-deletable Application" });

      const appId = newAppResponse.body.id;
      const response = await request
        .delete(`/api/applications/${appId}`)
        .set("Authorization", userToken);

      expect(response.status).toBe(403);
    });
  });
});
