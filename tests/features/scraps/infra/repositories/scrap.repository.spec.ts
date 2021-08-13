import { User } from "../../../../../src/core/domain";
import { ScrapEntity, UserEntity } from "../../../../../src/core/infra";
import Database from "../../../../../src/core/infra/data/connections/database";
import { Scrap } from "../../../../../src/features/scraps/domain";
import { ScrapRepository } from "../../../../../src/features/scraps/infra";

const makeUser = async (): Promise<User> => {
  return UserEntity.create({
    username: new Date().getMilliseconds().toLocaleString(),
    password: "any_password",
  }).save();
};

const makeParams = async () => {
  const user = await makeUser();

  return {
    title: "any_title",
    description: "any_description",
    userUid: user.uid,
  };
};

const makeScrap = async (): Promise<Scrap> => {
  const params = await makeParams();

  return ScrapEntity.create(params).save();
};

describe("Scrap repository", () => {
  beforeAll(async () => {
    await new Database().openConnection();
  });
  afterAll(async () => {
    await new Database().disconnectDatabase();
  });
  beforeEach(async () => {
    await ScrapEntity.delete({});
    await UserEntity.delete({});
  });

  describe("Create scrap", () => {
    it("Should create a scrap when pass valid params", async () => {
      const params = await makeParams();
      const sut = new ScrapRepository();
      const result = await sut.create(params);

      expect(result).toBeTruthy();
      expect(result.title).toEqual(params.title);
      expect(result.description).toEqual(params.description);
      expect(result.userUid).toEqual(params.userUid);
    });
  });

  describe("Get all scraps", () => {
    it("Should return any scraps on database when call this function", async () => {
      const params = await makeParams();
      const sut = new ScrapRepository();
      await sut.create(params);
      const result = await sut.getAll(params.userUid);

      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result[0].title).toEqual(params.title);
      expect(result[0].description).toEqual(params.description);
      expect(result[0].userUid).toEqual(params.userUid);
    });
  });
});
