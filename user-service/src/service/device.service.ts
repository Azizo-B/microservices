import { Device } from "@prisma/client";
import { Request } from "express";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";
import ServiceError from "../core/serviceError";
import { prisma } from "../data";
import { DeviceAndIps, DeviceFiltersWithPagination } from "../types/device.types";
import handleDBError from "./_handleDBError";
import { checkPermission } from "./user.service";

export async function getAllDevices(userId: string, filters: DeviceFiltersWithPagination): Promise<Device[]> {
  const { page = 0, limit = 10, ...remainingFilters } = filters;
  const skip = page * limit;
  const filter: any = { where: { ...remainingFilters }, skip, take: limit };

  const hasPermission = await checkPermission("userservice:list:any:device", userId);
  if (!hasPermission) {
    filter.where.userId = userId;
  }

  return await prisma.device.findMany(filter);
}

export async function getDeviceById(id: string, userId: string): Promise<DeviceAndIps> {
  const device = await prisma.device.findUnique({ where: { id }, include: { ips: true } });

  if (!device) {
    throw ServiceError.notFound("Device not found.");
  }

  const hasPermission = await checkPermission("userservice:read:any:device", userId);

  if (userId !== device.userId && !hasPermission) {
    throw ServiceError.notFound("Device not found");
  }

  const ips = device.ips.map((ip) => ip.ipAddress);

  return { ...device, ips };
}

export async function createDevice(req: Request): Promise<string> {
  try {
    const userAgent = req.headers["user-agent"] || "Unknown";
    const parser = new UAParser(userAgent);
    const parsedUA = parser.getResult();

    let device = await prisma.device.findFirst({
      where: {
        userId: req.userId,
        userAgent: userAgent,
      },
      select: { id: true },
    });

    const GcpRemoteIp = req.headers["remoteIp"]?.toString();
    const reqIp = req.ip;
    const remoteAddress = req.socket.remoteAddress;

    const ipCandidates = [GcpRemoteIp, reqIp, remoteAddress];

    let geo = null;
    let ipAddress = "Unknown";
    for (const ip of ipCandidates) {
      if (ip) {
        geo = geoip.lookup(ip);
        if (geo) {
          ipAddress = ip;
          break;
        }
      }
    }

    if (device) {
      if (ipAddress !== "Unknown") {
        await prisma.ip.create({ data: { ipAddress, device: { connect: { id: device.id } } } });
      }
      return device.id;
    }

    const deviceInfo = {
      browser: parsedUA.browser.name || "Unknown",
      browserVersion: parsedUA.browser.version || "Unknown",
      os: parsedUA.os.name || "Unknown",
      osVersion: parsedUA.os.version || "Unknown",
      deviceType: parsedUA.device.type || "Unknown",
      deviceVendor: parsedUA.device.vendor || "Unknown",
      deviceModel: parsedUA.device.model || "Unknown",
      engine: parsedUA.engine.name || "Unknown",
      engineVersion: parsedUA.engine.version || "Unknown",
      cpuArchitecture: parsedUA.cpu.architecture || "Unknown",
      city: geo?.city || "Unknown",
      country: geo?.country || "Unknown",
      region: geo?.region || "Unknown",
      language: req.headers["accept-language"] || "Unknown",
      referer: req.headers["referer"] || "Unknown",
      isSecure: req.secure,
      timestamp: new Date().toISOString(),
    };

    device = await prisma.device.create({
      data: {
        userAgent: userAgent,
        ipAddress,
        ...deviceInfo,
        user: { connect: { id: req.userId } },
      },
    });

    if (ipAddress !== "Unknown") {
      await prisma.ip.create({ data: { ipAddress, device: { connect: { id: device.id } } } });
    }

    return device.id;
  } catch (error) {
    handleDBError(error);
  }
}
