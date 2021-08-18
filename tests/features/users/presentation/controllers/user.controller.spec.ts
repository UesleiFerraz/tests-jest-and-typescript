import { UserRepository } from "../../../../../src/features/users/infra";
import { User } from "../../../../../src/core/domain";
import { UserController } from "../../../../../src/features/users/presentation";
import {
  ok,
  serverError,
  conflict,
} from "../../../../../src/core/presentation";

jest.mock(
  "../../../../../src/features/users/infra/repositories/user.repository.ts"
);
const UserRepositoryMock = UserRepository as jest.Mock<UserRepository>;

const makeSut = (): UserController => {
  return new UserController(
    new UserRepositoryMock() as jest.Mocked<UserRepository>
  );
};

const makeRequest = () => {
  return {
    params: { uid: "any_uid" },
    body: {
      username: "any_username",
      password: "any_password",
    },
  };
};

const makeResult = (): Omit<User, "password"> => ({
  uid: "any_uid",
  username: "any_username",
});

describe("User controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("Store user", () => {
    it("Should return conflit if username already exists", async () => {
      jest
        .spyOn(UserRepository.prototype, "getOne")
        .mockResolvedValue(makeResult() as any);
      const sut = makeSut();
      const result = await sut.store(makeRequest());

      expect(result).toEqual(conflict("Username"));
    });

    it("Should return serverError if throw any error", async () => {
      jest
        .spyOn(UserRepository.prototype, "getOne")
        .mockRejectedValue(new Error());
      const sut = makeSut();
      const result = await sut.store(makeRequest());

      expect(result).toEqual(serverError());
    });

    it("Should return ok if success", async () => {
      jest.spyOn(UserRepository.prototype, "getOne").mockResolvedValue(null);
      jest
        .spyOn(UserRepository.prototype, "create")
        .mockResolvedValue(makeResult());
      const sut = makeSut();
      const result = await sut.store(makeRequest());

      expect(result).toEqual(ok(makeResult()));
    });
  });

  describe("Show user", () => {
    it("Should return serverError if throw any error", async () => {
      jest
        .spyOn(UserRepository.prototype, "getOne")
        .mockRejectedValue(new Error());
      const sut = makeSut();
      const result = await sut.show(makeRequest());

      expect(result).toEqual(serverError());
    });

    it("Should return conflict if the user exists", async () => {
      jest
        .spyOn(UserRepository.prototype, "getOne")
        .mockResolvedValue(makeResult() as any);
      const sut = makeSut();
      const result = await sut.show(makeRequest());

      expect(result).toEqual(conflict("Username"));
    });

    it("Should return ok if the user does not exists", async () => {
      jest.spyOn(UserRepository.prototype, "getOne").mockResolvedValue(null);
      const sut = makeSut();
      const result = await sut.show(makeRequest());

      expect(result).toEqual(ok({}));
    });
  });

  describe("Update user", () => {
    it("Should throw an error when this method is called", async () => {
      const sut = makeSut();
      const result = sut.update;

      expect(result).toThrowError();
    });
  });

  describe("Delete user", () => {
    it("Should throw an error when this method is called", async () => {
      const sut = makeSut();
      const result = sut.delete;

      expect(result).toThrowError();
    });
  });

  describe("Index user", () => {
    it("Should throw an error when this method is called", async () => {
      const sut = makeSut();
      const result = sut.index;

      expect(result).toThrowError();
    });
  });
});
