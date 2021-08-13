import { Router } from "express";
import {
  EMVC,
  middlewareAdapter,
  routerAdapter,
  routerMvcAdapter,
} from "../../../scraps/presentation";
import { UserRepository } from "../../infra";
import { UserController } from "../controllers";
import { AuthUserController } from "../controllers/auth-user.controller";
import { UserFieldsMiddleware } from "../middlewares";

const makeController = () => {
  const repository = new UserRepository();

  return new UserController(repository);
};

export default class UserRoutes {
  public init(routes: Router): void {
    routes.post(
      "/users",
      middlewareAdapter(new UserFieldsMiddleware()),
      routerMvcAdapter(makeController(), EMVC.STORE)
    );
    routes.post(
      "/auth",
      middlewareAdapter(new UserFieldsMiddleware()),
      routerAdapter(new AuthUserController(new UserRepository()))
    );

    routes.get(
      "/users/:username",
      routerMvcAdapter(makeController(), EMVC.SHOW)
    );
  }
}
