import { Device } from "@prisma/client";

export interface BasicDeviceInfo{
  id: string;
  userAgent: string;
  deviceType: string;
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  ips: string[];
}

export interface DeviceAndIps extends Device {
  ips: string[]
}