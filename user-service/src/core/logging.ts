import config from "config";
import winston from "winston";

const LOG_LEVEL = config.get<string>("log.level");
const LOG_DISABLED = config.get<boolean>("log.disabled");
const ENV = config.get<string>("env");

const ENV_STRINGS: Record<string, string> = {
  production: "\x1b[31mPROD\x1b[0m",
  development: "\x1b[34mDEV\x1b[0m",
  testing: "\x1b[32mTEST\x1b[0m",
};

const rootLogger: winston.Logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize({
      colors: {
        info: "green",
        debug: "blue",
        error: "red",
        warning: "yellow",
      },
    }),
    winston.format.printf(({ level, timestamp, message }) => {
      return `[${ENV_STRINGS[ENV]}] - [${level}] - ${timestamp} - ${message}`;
    })
  ),
  transports: [new winston.transports.Console({ silent: LOG_DISABLED })],
});

export const getLogger = () => {
  return rootLogger;
};
