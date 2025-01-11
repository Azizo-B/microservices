import type supertest from "supertest";

export const login = async (supertest: supertest.Agent): Promise<string> => {
  const response = await supertest.post("/api/tokens/sessions").send({
    appId: "507f191e810c19729de860ea",
    email: "test@test.localhost.com",
    password: "test",
  });

  if (response.statusCode !== 200) {
    throw new Error(response.body.message || "Unknown error occured");
  }

  return `Bearer ${response.body.token}`;
};

export const loginAdmin = async (supertest: supertest.Agent): Promise<string> => {
  const response = await supertest.post("/api/tokens/sessions").send({
    appId: "507f191e810c19729de860ea",
    email: "admin@test.localhost.com",
    password: "admin",
  });

  if (response.statusCode !== 200) {
    throw new Error(response.body.message || "Unknown error occured");
  }

  return `Bearer ${response.body.token}`;
};