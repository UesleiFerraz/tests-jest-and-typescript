import { unauthorized, ok } from "../../../../../src/core/presentation";
import { UserAuthMiddleware } from "./../../../../../src/features/scraps/presentation/middlewares/user-auth.middleware";
import jwt from "jsonwebtoken";

const makeSut = () => {
  return new UserAuthMiddleware();
};

describe("AuthMiddleware", () => {
  it("Should return unauthorized if there is no token", async () => {
    const sut = makeSut();
    const result = sut.handle("" as any);

    expect(result).toEqual(unauthorized());
  });

  it("Should return unauthorized if throw any exception", async () => {
    jest.spyOn(jwt, "verify").mockReturnValue(new Error("") as any);
    const sut = makeSut();
    const result = sut.handle("" as any);

    expect(result).toEqual(unauthorized());
  });

  it("Should return unauthorized if token is invalid", async () => {
    jest.spyOn(jwt, "verify").mockReturnValue(false as any);
    const sut = makeSut();
    const result = sut.handle("" as any);

    expect(result).toEqual(unauthorized());
  });

  it("Should return ok and the userUid if token is valid", async () => {
    jest.spyOn(jwt, "verify").mockReturnValue({
      uid: "any_uid",
      iat: "any_iat",
      exp: "any_exp",
    } as any);
    const sut = makeSut();
    const result = sut.handle({
      headers: { authorization: "Bearer any_token" },
    } as any);

    expect(result).toEqual(ok({ userUid: "any_uid" }));
  });
});
