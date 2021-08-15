import express, { Router } from "express";
import {
  CacheRepository,
  ScrapEntity,
  UserEntity,
} from "../../../../../src/core/infra";
import { Scrap } from "../../../../../src/features/scraps/domain";
import Database from "../../../../../src/core/infra/data/connections/database";
import ScrapRoutes from "../../../../../src/features/scraps/presentation/routes/routes";
import supertest from "supertest";
import { ScrapRepository } from "../../../../../src/features/scraps/infra";
import App from "../../../../../src/core/presentation/app";
import { ok } from "../../../../../src/core/presentation";
import { UserAuthMiddleware } from "../../../../../src/features/scraps/presentation/middlewares/user-auth.middleware";

const makeUser = async (): Promise<UserEntity> => {
  return UserEntity.create({
    username: new Date().getMilliseconds().toLocaleString(),
    password: "any_password",
  }).save();
};

const makeScrap = async (): Promise<Scrap> => {
  const user = await makeUser();
  return ScrapEntity.create({
    title: "any_name",
    description: "any_description",
    userUid: user.uid,
  }).save();
};

describe("Scrap routes", () => {
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

    new ScrapRoutes().init(router);
  });

  afterAll(async () => {
    await new Database().disconnectDatabase();
  });

  describe("/Get scraps", () => {
    it("Should return all scraps if has any scrap", async () => {
      const scrap = await makeScrap();
      jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue([scrap]);
      jest
        .spyOn(UserAuthMiddleware.prototype, "handle")
        .mockReturnValue(ok({ userUid: scrap.userUid }));

      await supertest(server)
        .get("/scraps")
        .expect(200)
        .expect(request => {
          expect(request.body.scraps.length).toBeGreaterThanOrEqual(1),
            expect(request.body.scraps[0].uid).toEqual(scrap.uid);
        });
    });

    it("Should return an empty array of scraps if user has no scrap", async () => {
      const user = await makeUser();
      jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
      jest.spyOn(CacheRepository.prototype, "setex").mockResolvedValue(null);
      jest
        .spyOn(UserAuthMiddleware.prototype, "handle")
        .mockReturnValue(ok({ userUid: user.uid }));

      await supertest(server)
        .get("/scraps")
        .expect(200)
        .expect(request => {
          expect(request.body.scraps.length).toEqual(0);
        });
    });

    describe("/Post scraps", () => {
      it("Should return code 200 when save a valid scrap", async () => {
        const user = await makeUser();
        jest
          .spyOn(UserAuthMiddleware.prototype, "handle")
          .mockReturnValue(ok({ userUid: user.uid }));

        await supertest(server)
          .post("/scraps")
          .send({
            title: "any_title",
            description: "any_description",
            userUid: user.uid,
          })
          .expect(200)
          .expect(request => {
            expect(request.body.scrap.uid).toBeTruthy(),
              expect(request.body.scrap.userUid).toEqual(user.uid);
          });
      });

      it("Should return code 400 if there is no title", async () => {
        const user = await makeUser();
        jest
          .spyOn(UserAuthMiddleware.prototype, "handle")
          .mockReturnValue(ok({ userUid: user.uid }));

        await supertest(server)
          .post("/scraps")
          .send({
            description: "any_description",
            userUid: user.uid,
          })
          .expect(400)
          .expect(request => {
            expect(request.body.error).toEqual("Missing param: title");
          });
      });

      it("Should return code 400 if there is no description", async () => {
        const user = await makeUser();
        jest
          .spyOn(UserAuthMiddleware.prototype, "handle")
          .mockReturnValue(ok({ userUid: user.uid }));

        await supertest(server)
          .post("/scraps")
          .send({
            title: "any_title",
            userUid: user.uid,
          })
          .expect(400)
          .expect(request => {
            expect(request.body.error).toEqual("Missing param: description");
          });
      });
    });
  });
});
