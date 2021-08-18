import { UserRepository } from "../../../../../src/features/users/infra";
import { User } from "../../../../../src/core/domain";
import { UserController } from "../../../../../src/features/users/presentation";

import {
  notFound,
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
  });
});
