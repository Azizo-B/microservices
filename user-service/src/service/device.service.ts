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
    const parser = new UAParser(userAgent);
    const parsedUA = parser.getResult();

    // Extract IPs from headers and request
    const xForwardedFor = req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim();
    const xRealIp = req.headers["x-real-ip"]?.toString();
    const GcpRemoteIp = req.headers["remoteIp"]?.toString();
    const reqIp = req.ip;
    const remoteAddress = req.connection.remoteAddress;

    // Aggregate potential IPs
    const ipCandidates = [xForwardedFor, xRealIp, GcpRemoteIp, reqIp, remoteAddress];

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
          userAgent: userAgent,
          ipAddress,
          ...deviceInfo,
          user:{
            connect:{
              id: req.userId,
            },
          },
        },
      });
    
      await prisma.ip.create({
        data: {
          ipAddress,
          device:{
            connect:{
              id: device.id,
            },
          },
        },
      });
    }
    
    return device.id;
  }catch(error){
    handleDBError(error);
  }
};