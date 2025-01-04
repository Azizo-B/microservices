import argon2 from "argon2";
import config from "config";

const ARGON_HASH_LENGTH = config.get<number>("auth.argon.hashLength");
const ARGON_TIME_COST = config.get<number>("auth.argon.timeCost");
const ARGON_MEMORY_COST = config.get<number>("auth.argon.memoryCost");

export const hashPassword = async (password: string): Promise<string> => {
  return argon2.hash(password, {
    type: argon2.argon2id,
    hashLength: ARGON_HASH_LENGTH,
    timeCost: ARGON_TIME_COST,
    memoryCost: ARGON_MEMORY_COST,
  });
};

export const verifyPassword = async (
  password: string,
  passwordHash: string,
): Promise<boolean> => {
  return argon2.verify(passwordHash, password);
};