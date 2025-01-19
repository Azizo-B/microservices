import config from "config";
import crypto from "crypto";
import ServiceError from "./serviceError";

const ENCRYPTION_KEY: string = config.get<string>("encryption.key");
const IV_LENGTH = 16;

if (ENCRYPTION_KEY.length !== 64) {
  throw new Error("Encryption key must be 64 characters long (32 bytes). Got: " + ENCRYPTION_KEY.length);
}

export function encrypt(text: string): string {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text, "utf8");
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
  } catch (error) {
    throw ServiceError.internalServerError(`Encryption failed: ${error}`);
  }
}

export function decrypt(text: string): string {
  try {
    const [ivHex, encryptedHex] = text.split(":");
    if (!ivHex || !encryptedHex) {
      throw ServiceError.internalServerError("Invalid encrypted text format.");
    }

    const iv = Buffer.from(ivHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString("utf8");
  } catch (error) {
    throw ServiceError.internalServerError(`Decryption failed: ${error}`);
  }
}
