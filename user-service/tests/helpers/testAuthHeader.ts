import type supertest from "supertest";

export default function testAuthHeader(requestFactory: () => supertest.Test): void {
  it("should 401 when no authorization token provided", async () => {
    const response = await requestFactory();

    expect(response.statusCode).toBe(401);
    expect(response.body.code).toBe("UNAUTHORIZED");
    expect(response.body.message).toBe("You need to be signed in.");
  });

  it("should 401 when invalid authorization token provided", async () => {
    const response = await requestFactory().set(
      "Authorization",
      "INVALID TOKEN",
    );

    expect(response.statusCode).toBe(401);
    expect(response.body.code).toBe("UNAUTHORIZED");
    expect(response.body.message).toBe("Invalid authentication token.");
  });
}