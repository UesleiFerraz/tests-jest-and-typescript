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

  describe("Create", () => {
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

  describe("Get all", () => {
    it("Should return any scraps on database when user has scraps", async () => {
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

    it("Should pass an userUid as a parameter when call this function", async () => {
      const sut = new ScrapRepository();
      jest.spyOn(sut, "getAll").mockResolvedValue([await makeScrap()]);
      const spy = jest.spyOn(sut, "getAll");

      await sut.getAll("any_user_uid");

      expect(spy).toHaveBeenCalledWith("any_user_uid");
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("Should return an empty array when user has no scraps", async () => {
      const sut = new ScrapRepository();
      const user = await makeUser();
      const result = await sut.getAll(user.uid);

      expect(result).toBeTruthy();
      expect(result.length).toEqual(0);
    });
  });

  describe("Get one", () => {
    it("Should return null if database doesn't find any scraps that match the params", async () => {
      const sut = new ScrapRepository();
      const user = await makeUser();
      const scrap = await makeScrap();
      const result1 = await sut.getOne(scrap.uid, user.uid);
      const result2 = await sut.getOne(user.uid, user.uid);

      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });
  });
});
