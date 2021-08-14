import { ScrapRepository } from "../../../../../src/features/scraps/infra";
import { CacheRepository } from "../../../../../src/core/infra/repositories";
import { Scrap } from "../../../../../src/features/scraps/domain";
import {
  ScrapController,
  serverError,
} from "../../../../../src/features/scraps/presentation";

jest.mock(
  "../../../../../src/features/scraps/infra/repositories/scrap.repository.ts"
);
jest.mock("../../../../../src/core/infra/repositories/cache.repository.ts");

const CacheRepositoryMock = CacheRepository as jest.Mock<CacheRepository>;
const ScrapRepositoryMock = ScrapRepository as jest.Mock<ScrapRepository>;

const makeSut = (): ScrapController => {
  return new ScrapController(
    new ScrapRepositoryMock() as jest.Mocked<ScrapRepository>,
    new CacheRepositoryMock() as jest.Mocked<CacheRepository>
  );
};

const makeRequestStore = () => {
  return {
    params: {},
    body: {
      title: "any_title",
      description: "any_description",
      userUid: "any_user_uid",
    },
  };
};

const makeRequestShow = () => ({
  body: {},
  params: { uid: "any_uid" },
});

const makeResult = (): Omit<Scrap, "user"> => ({
  uid: "any_uid",
  title: "any_title",
  description: "any_description",
  userUid: "any_uid",
});

describe("Scrap controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("Index", () => {
    it("Should return code 500 when throw any excepetion", async () => {
      jest
        .spyOn(CacheRepository.prototype, "get")
        .mockRejectedValue(new Error());

      const sut = makeSut();
      const result = await sut.index(makeRequestStore());

      expect(result).toEqual(serverError());
    });
  });
});
