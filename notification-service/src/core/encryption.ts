import config from "config";
import crypto from "crypto";
import ServiceError from "./serviceError";

const ENCRYPTION_KEY = crypto.createHash("sha256").update(config.get<string>("encryption.key")).digest();
const IV_LENGTH = config.get<number>("encryption.ivLength");

export function encrypt(text: string): string {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
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
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString("utf8");
  } catch (error) {
    throw ServiceError.internalServerError(`Decryption failed: ${error}`);
  }
}
