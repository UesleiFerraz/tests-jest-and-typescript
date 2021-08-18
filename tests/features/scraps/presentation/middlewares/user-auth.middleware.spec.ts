import { unauthorized } from "../../../../../src/core/presentation";
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
});
