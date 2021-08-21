require("dotenv").config();

let config = {};

if (process.env.NODE_ENV?.toLowerCase() === "test") {
  config = {
    type: "postgres",
    url:
      process.env.DOCKER_TEST_DB_URL ||
      "postgres://admin:admin@localhost:5432/scraps",
    entities: [`src/core/infra/data/database/entities/**/*`],
    migrations: [`src/core/infra/data/database/migrations/**/*`],
  };
} else {
  config = {
    type: process.env.DB_DIALECT,
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: true,
    entities: [
      `${process.env.SOURCE_DB}/core/infra/data/database/entities/**/*`,
    ],
    migrations: [
      `${process.env.SOURCE_DB}/core/infra/data/database/migrations/**/*`,
    ],
    cli: {
      entitiesDir: `${process.env.SOURCE_DB}/core/infra/data/database/entities`,
      migrationsDir: `${process.env.SOURCE_DB}/core/infra/data/database/migrations`,
    },
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  };
}
module.exports = config;
