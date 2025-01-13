import supertest from "supertest";
import { initializeData, shutdownData } from "../../src/data";
import { Server, createServer } from "../../src/server";
import { seedTestDatabase, wipeTestDatabase } from "./setupDatabase";

export default function withServer(setter: (s: supertest.Agent) => void): void {
  let server: Server;

  beforeAll(async () => {
    await initializeData();
    server = await createServer();
    await seedTestDatabase();
    setter(supertest(server.getApp()));
  });

  afterAll(async () => {
    await wipeTestDatabase();
    await shutdownData();
  });
}