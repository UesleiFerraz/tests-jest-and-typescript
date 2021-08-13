module.exports = {
  coverageDirectory: "coverage",
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  coveragePathIgnorePatterns: [
    "\\\\node_modules\\\\",
    "<rootDir>/src/core/infra/data/database/migrations",
  ],
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  transform: { ".+\\.ts$": "ts-jest" },
};
