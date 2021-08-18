import express, { Router } from "express";
import { ScrapEntity, UserEntity } from "../../../../../src/core/infra";
import { User } from "../../../../../src/core/domain";
import Database from "../../../../../src/core/infra/data/connections/database";
import UserRoutes from "../../../../../src/features/users/presentation/routes/routes";
import supertest from "supertest";
import { UserRepository } from "../../../../../src/features/users/infra";
import App from "../../../../../src/core/presentation/app";
import { ok, unauthorized } from "../../../../../src/core/presentation";
import { UserAuthMiddleware } from "../../../../../src/features/scraps/presentation/middlewares/user-auth.middleware";

describe("User routes", () => {
  const server = new App().server;

  beforeEach(async () => {
    await ScrapEntity.delete({});
    await UserEntity.delete({});

    jest.resetAllMocks();
  });

  beforeAll(async () => {
    await new Database().openConnection();

    const router = Router();
    server.use(express.json());

    server.use(router);

    new UserRoutes().init(router);
  });

  afterAll(async () => {
    await new Database().disconnectDatabase();
  });

  describe("Post /users", () => {
    it("Should return code 200 when save a valid user", async () => {
      await supertest(server)
        .post("/users")
        .send({
          username: "any_username",
          password: "any_password",
        })
        .expect(200)
        .expect(request => {
          expect(request.body.uid).toBeTruthy();
        });
    });
  });
});
