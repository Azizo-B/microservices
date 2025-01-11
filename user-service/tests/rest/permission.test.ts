import { prisma } from "../../src/data";
import { login, loginAdmin } from "../helpers/login";
import withServer from "../helpers/withServer";

let request: any;
let userToken: string;
let adminToken: string;

withServer((supertest) => {
  request = supertest;
});

describe("Permission REST", () => {

  beforeAll(async () => {
    userToken = await login(request);
    adminToken = await loginAdmin(request);
  });

  describe("POST /api/permissions", () => {
    it("should allow admin to create a new permission", async () => {
      const response = await request
        .post("/api/permissions")
        .set("Authorization", adminToken)
        .send({ name: "New Permission", description: "Test Permission" });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({ name: "New Permission", description: "Test Permission" });
    });

    it("should return 403 for regular users", async () => {
      const response = await request
        .post("/api/permissions")
        .set("Authorization", userToken)
        .send({ name: "Unauthorized Permission" });

      expect(response.status).toBe(403);
    });

    it("should return 400 for invalid input", async () => {
      const response = await request
        .post("/api/permissions")
        .set("Authorization", adminToken)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET /api/permissions", () => {
    it("should retrieve all permissions", async () => {
      const response = await request.get("/api/permissions");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("items");
      expect(Array.isArray(response.body.items)).toBe(true);

      response.body.items.forEach((permission: any) => {
        expect(permission).toHaveProperty("id");
        expect(permission).toHaveProperty("name");
      });
    });
  });

  describe("GET /api/permissions/:id", () => {
    it("should retrieve a permission by ID", async () => {
      const newPermissionResponse = await request
        .post("/api/permissions")
        .set("Authorization", adminToken)
        .send({ name: "Specific Permission", description: "Permission by ID" });

      const permissionId = newPermissionResponse.body.id;
      const response = await request.get(`/api/permissions/${permissionId}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ id: permissionId, name: "Specific Permission" });
    });

    it("should return 404 for non-existent permission", async () => {
      const response = await request.get("/api/permissions/507f191e810c19729de860eb");

      expect(response.status).toBe(404);
    });
  });

  describe("PATCH /api/permissions/:id", () => {
    it("should allow admin to update a permission", async () => {
      const newPermissionResponse = await request
        .post("/api/permissions")
        .set("Authorization", adminToken)
        .send({ name: "Updatable Permission", description: "Permission to update" });

      const permissionId = newPermissionResponse.body.id;
      const response = await request
        .patch(`/api/permissions/${permissionId}`)
        .set("Authorization", adminToken)
        .send({ name: "Updated Permission" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: permissionId, name: "Updated Permission", description: "Permission to update" });
    });

    it("should return 403 for regular users", async () => {
      const newPermissionResponse = await request
        .post("/api/permissions")
        .set("Authorization", adminToken)
        .send({ name: "Non-updatable Permission" });

      const permissionId = newPermissionResponse.body.id;
      const response = await request
        .patch(`/api/permissions/${permissionId}`)
        .set("Authorization", userToken)
        .send({ name: "Unauthorized Update" });

      expect(response.status).toBe(403);
    });
  });

  describe("DELETE /api/permissions/:id", () => {
    it("should allow admin to delete a permission", async () => {
      const newPermissionResponse = await request
        .post("/api/permissions")
        .set("Authorization", adminToken)
        .send({ name: "Deletable Permission" });

      const permissionId = newPermissionResponse.body.id;
      const response = await request
        .delete(`/api/permissions/${permissionId}`)
        .set("Authorization", adminToken);

      expect(response.status).toBe(204);
    const deletedPermission = await prisma.application.findFirst({where: {id: permissionId}})
    expect(deletedPermission).toBeNull()
    });

    it("should return 403 for regular users", async () => {
      const newPermissionResponse = await request
        .post("/api/permissions")
        .set("Authorization", adminToken)
        .send({ name: "Non-deletable Permission" });

      const permissionId = newPermissionResponse.body.id;
      const response = await request
        .delete(`/api/permissions/${permissionId}`)
        .set("Authorization", userToken);

      expect(response.status).toBe(403);
    });
  });
});
