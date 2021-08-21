import { UserRepository } from "../../../../../src/features/users/infra";
import { ok, notFound, forbidden } from "../../../../../src/core/presentation";
import { AuthUserController } from "./../../../../../src/features/users/presentation/controllers/auth-user.controller";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

jest.mock(
  "../../../../../src/features/users/infra/repositories/user.repository.ts"
);
const UserRepositoryMock = UserRepository as jest.Mock<UserRepository>;

const makeSut = (): AuthUserController => {
  return new AuthUserController(
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

describe("UserAuth controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("Handle", () => {
    it("Should return not found if the user does not exist", async () => {
      const sut = makeSut();
      const result = await sut.handle(makeRequest());

      expect(result).toEqual(notFound());
    });

    it("Should return forbidden if throw any error", async () => {
      jest
        .spyOn(UserRepository.prototype, "getOne")
        .mockRejectedValue(new Error());
      const sut = makeSut();
      const result = await sut.handle(makeRequest());

      expect(result).toEqual(forbidden());
    });

    it("Should return forbidden if password is invalid", async () => {
      const user = {
        username: "any_username",
        password: "any_password",
      };
      jest
        .spyOn(UserRepository.prototype, "getOne")
        .mockResolvedValue(user as any);
      const sut = makeSut();
      const result = await sut.handle({
        body: { username: "any_username", password: "invalid_password" },
      } as any);

      expect(result).toEqual(forbidden());
    });

    it("Should return ok and a token if valid data is provided", async () => {
      const user = {
        username: "any_username",
        password: "any_password",
      };
      jest
        .spyOn(UserRepository.prototype, "getOne")
        .mockResolvedValue(user as any);
      jest.spyOn(jwt, "sign").mockResolvedValue({ token: "" } as never);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);
      const sut = makeSut();
      const result = await sut.handle(makeRequest());

      expect(result).toEqual(ok({ token: Promise.resolve({ token: "" }) }));
    });
  });
});
