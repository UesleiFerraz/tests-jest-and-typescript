import {
  HttpRequest,
  HttpResponse,
  MVCController,
  notFound,
  ok,
  serverError,
} from "../../../../core/presentation";
import { ScrapRepository, CacheRepository } from "../../infra";

const ONE_MINUTE = 60;

export class ScrapController implements MVCController {
  readonly #repository: ScrapRepository;
  readonly #cache: CacheRepository;

  constructor(repository: ScrapRepository, cache: CacheRepository) {
    this.#repository = repository;
    this.#cache = cache;
  }

  public async index(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { userUid } = request.body;
      const cache = await this.#cache.get(`scrap:all:${userUid}`);

      if (cache) {
        return ok({ scraps: cache });
      }

      const scraps = await this.#repository.getAll(userUid);

      await this.#cache.setex(`scrap:all:${userUid}`, scraps, ONE_MINUTE);

      return ok({ scraps });
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }
  public async store(request: HttpRequest): Promise<HttpResponse> {
    try {
      const scrap = await this.#repository.create(request.body);
      const { userUid } = request.body;

      const scraps = await this.#repository.getAll(userUid);

      await this.#cache.setex(`scrap:all:${userUid}`, scraps, ONE_MINUTE);

      return ok({ scrap });
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }

  public async show(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { uid } = request.params;
      const { userUid } = request.body;

      const cache = await this.#cache.get(`scrap:${uid}:${userUid}`);

      if (cache) {
        return ok({ scrap: cache });
      }

      const scrap = await this.#repository.getOne(uid, userUid);

      await this.#cache.setex(`scrap:${uid}:${userUid}`, scrap, ONE_MINUTE);
      return ok({ scrap });
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }
  public async update(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { uid } = request.params;
      const { userUid } = request.body;

      const scrap = await this.#repository.update(uid, request.body);

      if (!scrap) {
        return notFound();
      }

      const scraps = await this.#repository.getAll(userUid);

      await this.#cache.setex(`scrap:${uid}:${userUid}`, scrap, ONE_MINUTE);
      await this.#cache.setex(`scrap:all:${userUid}`, scraps, ONE_MINUTE);

      return ok({ scrap });
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }
  public async delete(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { uid } = request.params;
      const { userUid } = request.body;

      const scrap = await this.#repository.delete(uid, userUid);

      if (!scrap) {
        return notFound();
      }

      const scraps = await this.#repository.getAll(userUid);

      await this.#cache.del(`scrap:${uid}:${userUid}`);
      await this.#cache.setex(`scrap:all:${userUid}`, scraps, ONE_MINUTE);

      return ok({});
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }
}
