import { prisma } from ".";
import { hashPassword } from "../core/password";
import { TokenType } from "../types/token.types";

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Cannot run seed in production");
  }

  // Delete all entities
  await prisma.token.deleteMany({});
  await prisma.ip.deleteMany({});
  await prisma.device.deleteMany({});
  await prisma.userRole.deleteMany({});
  await prisma.rolePermission.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.application.deleteMany({});

  // Create application
  const application = await prisma.application.create({
    data: {
      id: "6776f66b36f367b1e0f02bd3",
      name: "Rijexamenmeldingen",
    },
  });

  // Create user
  const user = await prisma.user.create({
    data: {
      email: "admin@localhost.com",
      appId: application.id,
      passwordHash: await hashPassword("admin"),
      username: "admin",
      isVerified: true,
    },
  });

  // Create token
  const token = await prisma.token.create({
    data: {
      userId: user.id,
      token: "seeded-token",
      expiresAt: new Date(),
      type: TokenType.SESSION,
      appId: application.id,
    },
  });

  const permissions = [
    "userservice:list:any:token",
    "userservice:read:any:token",
    "userservice:delete:any:token",
    "userservice:create:any:application",
    "userservice:update:any:application",
    "userservice:delete:any:application",
    "userservice:create:any:permission",
    "userservice:update:any:permission",
    "userservice:delete:any:permission",
    "userservice:create:any:role",
    "userservice:update:any:role",
    "userservice:delete:any:role",
    "userservice:assign:any:permission",
    "userservice:remove:any:permission",
    "userservice:list:any:user",
    "userservice:read:any:user",
    "userservice:update:any:user",
    "userservice:read:any:profile",
    "userservice:update:any:profile",
    "userservice:assign:any:role",
    "userservice:remove:any:role",
    "userservice:list:any:device",
    "userservice:read:any:device",
  ];

  // Create admin role with all permissions
  const adminRole = await prisma.role.create({
    data: {
      name: "admin",
    },
  });

  for (const permission of permissions) {
    await prisma.permission.create({
      data: {
        name: permission,
        rolePermissions: {
          create: {
            roleId: adminRole.id,
          },
        },
      },
    });
  }

  // Link admin role to user
  await prisma.userRole.create({
    data: {
      userId: user.id,
      roleId: adminRole.id,
    },
  });

  console.log("Application created:", application);
  console.log("User created:", user);
  console.log("Token created:", token);
  console.log("Admin role created:", adminRole);
  console.log("Permissions created:", permissions);
  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });