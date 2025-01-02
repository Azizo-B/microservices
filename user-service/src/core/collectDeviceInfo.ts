import { NextFunction, Request, Response } from "express";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";
import { prisma } from "../data";

export const collectDeviceInfo = async (req: Request, _: Response, next: NextFunction) => {
  try {
    req.deviceId = await createDevice(req);
    next();
  } catch (error) {
    next(error);
  }
};

export const createDevice = async (req: Request) => {
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
      ipAddress,
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
};
