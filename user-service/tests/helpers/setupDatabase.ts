import { hashPassword } from "../../src/core/password";
import { prisma } from "../../src/data";

export async function seedTestDatabase(){
    
  await prisma.application.create({data:{id:"507f191e810c19729de860ea", name:"Test Application"}});

  await prisma.user.createMany({
    data:[
      {
        id: "50af191aa10c19729de860ea",
        appId: "507f191e810c19729de860ea",
        username: "test user in test env",
        email: "test@test.localhost.com",
        passwordHash: await hashPassword("test"),
        isVerified: true,
      },
      {
        appId: "507f191e810c19729de860ea",
        username: "Unverified test user in test env",
        email: "test.unverified@test.localhost.com",
        passwordHash: await hashPassword("test"),
        isVerified: false,
      },
      {
        appId: "507f191e810c19729de860ea",
        username: "Banned test user in test env",
        email: "banned@test.localhost.com",
        passwordHash: await hashPassword("test"),
        isVerified: true,
        status: "banned",
      },
    ],
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

  const adminUser = await prisma.user.create({
    data: {
      appId: "507f191e810c19729de860ea",
      username: "Admin user in test env",
      email: "admin@test.localhost.com",
      passwordHash: await hashPassword("admin"),
      isVerified: true,
    },
  });

  // Link admin role to user
  await prisma.userRole.create({
    data: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });
}

export async function wipeTestDatabase(){
  await prisma.userRole.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.ip.deleteMany();
  await prisma.device.deleteMany();
  await prisma.token.deleteMany();
  await prisma.user.deleteMany();
  await prisma.application.deleteMany();
}