import { prisma } from "../data";

export async function getAllUsers() {
  const users = await prisma.user.findMany();
  return users;
}

export async function createUser(email: string) {
  await prisma.user.findUnique({ where: { email: email } });

  const user = await prisma.user.create({
    data: { email: email },
  });
  return user;
}
