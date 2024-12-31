import { prisma } from "../data";

export async function getAllUsers() {
  const users = await prisma.user.findMany();
  return users;
}

export async function createUser(email: string) {
  const user = await prisma.user.create({
    data: { email: email, is_verified: false, profile: {} },
  });
  return user;
}
