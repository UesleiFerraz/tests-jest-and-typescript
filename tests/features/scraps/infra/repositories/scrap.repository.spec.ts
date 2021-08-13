import { User } from "../../../../../src/core/domain";
import { ScrapEntity, UserEntity } from "../../../../../src/core/infra";
import Database from "../../../../../src/core/infra/data/connections/database";
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
});
