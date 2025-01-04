import config from "config";
import type {
  JwtPayload,
  Secret,
  SignOptions,
  VerifyOptions,
} from "jsonwebtoken";
import jwt from "jsonwebtoken";
import util from "node:util";

const JWT_AUDIENCE = config.get<string>("auth.jwt.audience");
const JWT_SECRET = config.get<string>("auth.jwt.secret");
const JWT_ISSUER = config.get<string>("auth.jwt.issuer");
const JWT_EXPIRATION_INTERVAL = config.get<number>("auth.jwt.expirationInterval");

const asyncJwtSign = util.promisify<JwtPayload, Secret, SignOptions, string>(jwt.sign);
const asyncJwtVerify = util.promisify<string, Secret, VerifyOptions, JwtPayload>(jwt.verify);

export const generateJWT = async (
  userId: string, roles: string[], permissions: string[], tokenId:string,
): Promise<string> => {
  const tokenData = { roles, permissions };

  const signOptions = {
    expiresIn: JWT_EXPIRATION_INTERVAL,
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
    subject: `${userId}`,
    jwtid: tokenId,
  };

  return asyncJwtSign(tokenData, JWT_SECRET, signOptions);
};

export const verifyJWT = async (authToken: string): Promise<JwtPayload> => {
  const verifyOptions = {
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
  };

  return asyncJwtVerify(authToken, JWT_SECRET, verifyOptions);
};
