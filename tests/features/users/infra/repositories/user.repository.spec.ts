import { User } from "../../../../../src/core/domain";
import { UserEntity } from "../../../../../src/core/infra";
import Database from "../../../../../src/core/infra/data/connections/database";
import { UserRepository } from "../../../../../src/features/users/infra";
import { v4 as makeRandomUid } from "uuid";

const makeUser = async (): Promise<User> => {
  return UserEntity.create({
    username: new Date().getMilliseconds().toLocaleString(),
    password: "any_password",
  }).save();
};

const makeParams = () => {
  return {
    username: "any_username",
    password: "any_password",
  };
};

describe("User repository", () => {
  beforeAll(async () => {
    await new Database().openConnection();
  });
  afterAll(async () => {
    await new Database().disconnectDatabase();
  });
  beforeEach(async () => {
    await UserEntity.delete({});
  });

  describe("Create user", () => {
    it("Should create a user when valid data is provided", async () => {
      const params = makeParams();
      const sut = new UserRepository();
      const result = await sut.create(params as any);

      expect(result).toBeTruthy();
      expect(result.uid).toBeTruthy();
      expect(result.username).toEqual(params.username);
    });
  });

  describe("Get All", () => {
    it("Should return all users when call this method", async () => {
      const params = await makeParams();
      const sut = new UserRepository();
      await sut.create(params as any);
      const result = await sut.getAll();

      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result[0].uid).toBeTruthy();
      expect(result[0].username).toEqual(params.username);
    });

    it("Should return an empty array if there is no user in database", async () => {
      const sut = new UserRepository();
      const result = await sut.getAll();

      expect(result).toBeTruthy();
      expect(result.length).toEqual(0);
    });
  });

  describe("Get one", () => {
    it("Should return null if there is no user that match the username", async () => {
      const sut = new UserRepository();
      const result = await sut.getOne("any_username");

      expect(result).toBeNull();
    });

    it("Should return the user that match the username", async () => {
      const params = await makeParams();
      const sut = new UserRepository();
      await sut.create(params as any);
      const result = (await sut.getOne(params.username)) as any;

      expect(result).toBeTruthy();
      expect(result.uid).toBeTruthy();
      expect(result.username).toEqual(params.username);
    });

    it("Should pass a username as parameter when call this method", async () => {
      const sut = new UserRepository();
      const spy = jest.spyOn(sut, "getOne");
      spy.mockResolvedValue(await makeUser());
      await sut.getOne("any_username");

      expect(spy).toHaveBeenCalledWith("any_username");
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
