import { ScrapRepository } from "../../../../../src/features/scraps/infra";
import { CacheRepository } from "../../../../../src/core/infra/repositories";
import { Scrap } from "../../../../../src/features/scraps/domain";
import { ScrapController } from "../../../../../src/features/scraps/presentation";

import { ok, serverError } from "../../../../../src/core/presentation";

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
  body: {
    userUid: "any_user_uid",
  },
  params: { uid: "any_uid" },
});

const makeResult = (): Omit<Scrap, "user"> => ({
  uid: "any_uid",
  title: "any_title",
  description: "any_description",
  userUid: "any_user_uid",
});

describe("Scrap controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("Index", () => {
    it("Should return serverError when throw any excepetion", async () => {
      jest
        .spyOn(CacheRepository.prototype, "get")
        .mockRejectedValue(new Error());

      const sut = makeSut();
      const result = await sut.index(makeRequestStore());

      expect(result).toEqual(serverError());
    });

    it("Should call cache of the user when this method is called", async () => {
      const sut = makeSut();
      const spy = jest.spyOn(CacheRepository.prototype, "get");
      await sut.index(makeRequestStore());

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("scrap:all:any_user_uid");
    });

    it("Should return all scraps of the user if has any scraps on cache", async () => {
      jest
        .spyOn(CacheRepository.prototype, "get")
        .mockResolvedValue([makeResult()]);
      const sut = makeSut();
      const result = await sut.index(makeRequestStore());

      expect(result).toEqual(ok({ scraps: [makeResult()] }));
    });

    it("Should call repository with userUid as param if the cache doesn't have any scraps", async () => {
      jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
      const spy = jest.spyOn(ScrapRepository.prototype, "getAll");
      const sut = makeSut();
      await sut.index(makeRequestStore());

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("any_user_uid");
    });

    it("Should return all scraps of the user if has any scraps on repository", async () => {
      jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
      jest
        .spyOn(ScrapRepository.prototype, "getAll")
        .mockResolvedValue([makeResult()] as any);
      const sut = makeSut();
      const result = await sut.index(makeRequestStore());

      expect(result).toEqual(ok({ scraps: [makeResult()] }));
    });

    it("Should call setex of cache if it doesn't find scraps on cache", async () => {
      jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
      jest
        .spyOn(ScrapRepository.prototype, "getAll")
        .mockResolvedValue([makeResult()] as any);
      const spy = jest.spyOn(CacheRepository.prototype, "setex");
      const sut = makeSut();
      await sut.index(makeRequestStore());

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        "scrap:all:any_user_uid",
        [makeResult()],
        60
      );
    });

    describe("Store", () => {
      it("Should return serverError when throw any error", async () => {
        jest
          .spyOn(CacheRepository.prototype, "setex")
          .mockRejectedValue(new Error());
        const sut = makeSut();
        const result = await sut.store(makeRequestStore());

        expect(result).toEqual(serverError());
      });

      it("Should call repository with request.body if the request is valid", async () => {
        const sut = makeSut();
        const spy = jest.spyOn(ScrapRepository.prototype, "create");
        await sut.store(makeRequestStore());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(makeRequestStore().body);
      });

      it("Should create and return the scrap if the request is valid", async () => {
        jest
          .spyOn(ScrapRepository.prototype, "create")
          .mockResolvedValue(makeResult() as any);
        const sut = makeSut();
        const result = (await sut.store(makeRequestStore())) as any;

        expect(result).toEqual(ok({ scrap: makeResult() }));
      });

      it("Should call getAll of repository and setex of cache after create the scrap", async () => {
        jest
          .spyOn(ScrapRepository.prototype, "create")
          .mockResolvedValue(makeResult() as any);
        jest
          .spyOn(ScrapRepository.prototype, "getAll")
          .mockResolvedValue([makeResult()] as any);
        const getSpy = jest.spyOn(ScrapRepository.prototype, "getAll");
        const setSpy = jest.spyOn(CacheRepository.prototype, "setex");
        const sut = makeSut();
        await sut.store(makeRequestStore());

        expect(getSpy).toHaveBeenCalledTimes(1);
        expect(getSpy).toHaveBeenCalledWith("any_user_uid");
        expect(setSpy).toHaveBeenCalledTimes(1);
        expect(setSpy).toHaveBeenCalledWith(
          "scrap:all:any_user_uid",
          [makeResult()],
          60
        );
      });
    });

    describe("Show", () => {
      it("Should return serverError when throw any exception", async () => {
        jest
          .spyOn(CacheRepository.prototype, "get")
          .mockRejectedValue(new Error());
        const sut = makeSut();
        const result = await sut.show(makeRequestStore());

        expect(result).toEqual(serverError());
      });

      it("Should call cache of the user when this method is called", async () => {
        const sut = makeSut();
        const spy = jest.spyOn(CacheRepository.prototype, "get");
        await sut.show(makeRequestShow());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith("scrap:any_uid:any_user_uid");
      });

      it("Should return the scrap if has any scrap on cache", async () => {
        jest
          .spyOn(CacheRepository.prototype, "get")
          .mockResolvedValue(makeResult() as any);
        const sut = makeSut();
        const result = await sut.show(makeRequestStore());

        expect(result).toEqual(ok({ scrap: makeResult() }));
      });

      it("Should call repository with uid and userUid as params if the cache doesn't have any scrap", async () => {
        jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
        const spy = jest.spyOn(ScrapRepository.prototype, "getOne");
        const sut = makeSut();
        await sut.show(makeRequestShow());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith("any_uid", "any_user_uid");
      });
    });
  });
});
