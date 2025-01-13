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
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  coverageDirectory: "tests/coverage",
  testTimeout: 120000,
  forceExit: true,
};

export default config;