import type { Config } from "jest";

const config: Config = {
  
  coverageProvider: "v8",
  preset: "ts-jest",
  testMatch: [
    "**/tests/**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  collectCoverageFrom: [
    "./src/service/**/*.ts",
    "./src/rest/**/*.ts",
  ],
  coverageDirectory: "tests/coverage",
};

export default config;