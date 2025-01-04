import { Device } from "@prisma/client";
import { Request } from "express";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";
import ServiceError from "../core/serviceError";
import { prisma } from "../data";
import { DeviceAndIps } from "../types/device.types";
import handleDBError from "./_handleDBError";
import { checkPermission } from "./user.service";

export async function getAllDevices(userId: string): Promise<Device[]> {
  const hasPermission = await checkPermission("userservice:list:any:device", userId);

  let filter = {};
  if(!hasPermission){
    filter = {where: {userId}};
  }

  const devices = await prisma.device.findMany(filter);
  return devices;
}

export async function getDeviceById(id: string, userId: string): Promise<DeviceAndIps> {
  const device = await prisma.device.findUnique({ where: { id }, include: { ips: true } });

  if (!device) {
    throw ServiceError.notFound("Device not found.");
  }

  const hasPermission = await checkPermission("userservice:read:any:device", userId);

  if(userId !== device.userId && !hasPermission){
    throw ServiceError.notFound("Device not found"); 
  }

  const ips = device.ips.map((ip) => ip.ipAddress);
  
  return {...device, ips};
}

export const createDevice = async (req: Request) => {
  try{
    const userAgent = req.headers["user-agent"] || "Unknown";
    const ipAddress = req.ip || req.connection.remoteAddress || "Unknown";
    
    const parser = new UAParser(userAgent);
    const parsedUA = parser.getResult();
    const geo = geoip.lookup(ipAddress);
    
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
    
    let device = await prisma.device.findFirst({
      where: {
        userId: req.userId,
        userAgent: userAgent,
      },
    });
    
    if (!device) {
      device = await prisma.device.create({
        data: {
          userId: req.userId,
          userAgent: userAgent,
          ipAddress,
          ...deviceInfo,
        },
      });
    
      await prisma.ip.create({
        data: {
          deviceId: device.id,
          ipAddress,
        },
      });
    }
    
    return device.id;
  }catch(error){
    handleDBError(error);
  }
};