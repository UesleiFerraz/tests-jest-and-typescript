import { ScrapRepository } from "../../../../../src/features/scraps/infra";
import { CacheRepository } from "../../../../../src/core/infra/repositories";
import { Scrap } from "../../../../../src/features/scraps/domain";
import { ScrapController } from "../../../../../src/features/scraps/presentation";

import {
  notFound,
  ok,
  serverError,
} from "../../../../../src/core/presentation";

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

const makeRequest = () => {
  return {
    params: { uid: "any_uid" },
    body: {
      title: "any_title",
      description: "any_description",
      userUid: "any_user_uid",
    },
  };
};

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
      const result = await sut.index(makeRequest());

      expect(result).toEqual(serverError());
    });

    it("Should call cache of the user when this method is called", async () => {
      const sut = makeSut();
      const spy = jest.spyOn(CacheRepository.prototype, "get");
      await sut.index(makeRequest());

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("scrap:all:any_user_uid");
    });

    it("Should return all scraps of the user if has any scraps on cache", async () => {
      jest
        .spyOn(CacheRepository.prototype, "get")
        .mockResolvedValue([makeResult()]);
      const sut = makeSut();
      const result = await sut.index(makeRequest());

      expect(result).toEqual(ok({ scraps: [makeResult()] }));
    });

    it("Should call repository with userUid as param if the cache doesn't have any scraps", async () => {
      jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
      const spy = jest.spyOn(ScrapRepository.prototype, "getAll");
      const sut = makeSut();
      await sut.index(makeRequest());

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("any_user_uid");
    });

    it("Should return all scraps of the user if has any scraps on repository", async () => {
      jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
      jest
        .spyOn(ScrapRepository.prototype, "getAll")
        .mockResolvedValue([makeResult()] as any);
      const sut = makeSut();
      const result = await sut.index(makeRequest());

      expect(result).toEqual(ok({ scraps: [makeResult()] }));
    });

    it("Should call setex of cache if it doesn't find scraps on cache", async () => {
      jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
      jest
        .spyOn(ScrapRepository.prototype, "getAll")
        .mockResolvedValue([makeResult()] as any);
      const spy = jest.spyOn(CacheRepository.prototype, "setex");
      const sut = makeSut();
      await sut.index(makeRequest());

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
        const result = await sut.store(makeRequest());

        expect(result).toEqual(serverError());
      });

      it("Should call repository with request.body if the request is valid", async () => {
        const sut = makeSut();
        const spy = jest.spyOn(ScrapRepository.prototype, "create");
        await sut.store(makeRequest());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(makeRequest().body);
      });

      it("Should create and return the scrap if the request is valid", async () => {
        jest
          .spyOn(ScrapRepository.prototype, "create")
          .mockResolvedValue(makeResult() as any);
        const sut = makeSut();
        const result = (await sut.store(makeRequest())) as any;

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
        await sut.store(makeRequest());

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
        const result = await sut.show(makeRequest());

        expect(result).toEqual(serverError());
      });

      it("Should call cache of the user when this method is called", async () => {
        const sut = makeSut();
        const spy = jest.spyOn(CacheRepository.prototype, "get");
        await sut.show(makeRequest());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith("scrap:any_uid:any_user_uid");
      });

      it("Should return the scrap if has any scrap on cache", async () => {
        jest
          .spyOn(CacheRepository.prototype, "get")
          .mockResolvedValue(makeResult() as any);
        const sut = makeSut();
        const result = await sut.show(makeRequest());

        expect(result).toEqual(ok({ scrap: makeResult() }));
      });

      it("Should call repository with uid and userUid as params if the cache doesn't have any scrap", async () => {
        jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
        const spy = jest.spyOn(ScrapRepository.prototype, "getOne");
        const sut = makeSut();
        await sut.show(makeRequest());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith("any_uid", "any_user_uid");
      });

      it("Should call the repository if the cache doesn't have scrap", async () => {
        jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
        const spy = jest.spyOn(ScrapRepository.prototype, "getOne");
        const sut = makeSut();
        await sut.show(makeRequest());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith("any_uid", "any_user_uid");
      });

      it("Should return the scrap if has any scrap on repository", async () => {
        jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
        jest
          .spyOn(ScrapRepository.prototype, "getOne")
          .mockResolvedValue(makeResult() as any);
        const sut = makeSut();
        const result = await sut.show(makeRequest());

        expect(result).toEqual(ok({ scrap: makeResult() }));
      });

      it("Should return notFound if the repository doesn't has any scrap", async () => {
        jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
        jest.spyOn(ScrapRepository.prototype, "getOne").mockResolvedValue(null);
        const sut = makeSut();
        const result = await sut.show(makeRequest());

        expect(result).toEqual(notFound());
      });

      it("Should call setex of cache after the repository find any scrap", async () => {
        jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
        jest
          .spyOn(ScrapRepository.prototype, "getOne")
          .mockResolvedValue(makeResult() as any);
        const setSpy = jest.spyOn(CacheRepository.prototype, "setex");
        const sut = makeSut();
        await sut.show(makeRequest());

        expect(setSpy).toHaveBeenCalledTimes(1);
        expect(setSpy).toHaveBeenCalledWith(
          "scrap:any_uid:any_user_uid",
          makeResult(),
          60
        );
      });
    });

    describe("Update", () => {
      it("Should return serverError if throw any error", async () => {
        jest
          .spyOn(ScrapRepository.prototype, "update")
          .mockRejectedValue(new Error());
        const sut = makeSut();
        const result = await sut.update(makeRequest());

        expect(result).toEqual(serverError());
      });

      it("Should return notFound if doesn't find any scrap that match the params", async () => {
        jest.spyOn(ScrapRepository.prototype, "update").mockResolvedValue(null);
        const sut = makeSut();
        const result = await sut.update(makeRequest());

        expect(result).toEqual(notFound());
      });

      it("Should call update of the repository with scrapUid and request.body when call this method", async () => {
        const sut = makeSut();
        const spy = jest.spyOn(ScrapRepository.prototype, "update");
        await sut.update(makeRequest());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith("any_uid", makeRequest().body);
      });

      it("Should return ok and the updated scrap if the repository update the scrap", async () => {
        const request = makeRequest();
        request.body = {
          ...request.body,
          title: "new_title",
          description: "new_description",
        };
        jest
          .spyOn(ScrapRepository.prototype, "update")
          .mockResolvedValue(request as any);
        const sut = makeSut();
        const result = await sut.update(request);

        expect(result).toEqual(ok({ scrap: request }));
      });

      it("Should call the getAll method with userUid of the repository after update the scrap", async () => {
        jest
          .spyOn(ScrapRepository.prototype, "update")
          .mockResolvedValue(makeRequest() as any);
        const spy = jest.spyOn(ScrapRepository.prototype, "getAll");
        const sut = makeSut();
        await sut.update(makeRequest());

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith("any_user_uid");
      });

      it("Should call the setex method, 2 times, of the cache after update the scrap", async () => {
        jest
          .spyOn(ScrapRepository.prototype, "update")
          .mockResolvedValue(makeRequest() as any);
        jest
          .spyOn(ScrapRepository.prototype, "getAll")
          .mockResolvedValue([makeResult()] as any);
        const setSpy = jest.spyOn(CacheRepository.prototype, "setex");
        const sut = makeSut();
        await sut.update(makeRequest());

        expect(setSpy).toHaveBeenCalledTimes(2);
        expect(setSpy).toHaveBeenCalledWith(
          "scrap:any_uid:any_user_uid",
          makeRequest(),
          60
        );
        expect(setSpy).toHaveBeenCalledWith(
          "scrap:all:any_user_uid",
          [makeResult()],
          60
        );
      });
    });
  });
});
