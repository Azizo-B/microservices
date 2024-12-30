export default {
  port: 9000,
  log: {
    level: "silly",
    disabled: false,
  },
  cors: {
    origins: ["https://localhost:9000"],
    maxAge: 3 * 60 * 60,
  },
  auth: {
    maxDelay: 5000,
    argon: {
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },
    jwt: {
      audience: "user.service",
      issuer: "user.service",
    },
  },
};
