import {
  conflict,
  HttpRequest,
  HttpResponse,
  MVCController,
  ok,
  serverError,
} from "../../../../core/presentation";
import { UserRepository } from "../../infra";

export class UserController implements MVCController {
  readonly #repository: UserRepository;

  constructor(repository: UserRepository) {
    this.#repository = repository;
  }

  public async store(request: HttpRequest): Promise<HttpResponse> {
    try {
      const user = await this.#repository.getOne(request.body.username);

      if (user) {
        return conflict("Username");
      }

      const newUser = await this.#repository.create(request.body);

      return ok(newUser);
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }

  public async show(request: HttpRequest): Promise<HttpResponse> {
    try {
      const user = await this.#repository.getOne(request.params.username);

      if (user) {
        return conflict("Username");
      }

      return ok({});
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }

  index(request: HttpRequest): Promise<HttpResponse> {
    throw new Error("Method not implemented.");
  }
  update(request: HttpRequest): Promise<HttpResponse> {
    throw new Error("Method not implemented.");
  }
  delete(request: HttpRequest): Promise<HttpResponse> {
    throw new Error("Method not implemented.");
  }
}
