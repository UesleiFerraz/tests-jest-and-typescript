import {
  Controller,
  forbidden,
  HttpRequest,
  HttpResponse,
  notFound,
  ok,
} from "../../../../core/presentation";
import { UserRepository } from "../../infra";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthUserController implements Controller {
  readonly #repository: UserRepository;

  constructor(repository: UserRepository) {
    this.#repository = repository;
  }

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { username, password } = request.body;

      const user = await this.#repository.getOne(username);

      if (!user) {
        return notFound();
      }

      const secret = process.env.SECRET || "123";
      let token: string | undefined;
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return forbidden();
      }

      token = jwt.sign({ uid: user.uid }, secret, { expiresIn: "1h" });

      return ok({ token });
    } catch (error) {
      console.log(error);
      return forbidden();
    }
  }
}
