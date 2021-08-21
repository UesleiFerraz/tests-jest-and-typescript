import { Router } from "express";
import {
  EMVC,
  middlewareAdapter,
  MVCController,
  routerMvcAdapter,
} from "../../../../core/presentation";
import { CacheRepository, ScrapRepository } from "../../infra";
import { ScrapController } from "../controllers";
import { ScrapMiddleware } from "../middlewares";
import { UserAuthMiddleware } from "../middlewares/user-auth.middleware";
import { UuidValidatorMiddleware } from "../middlewares/uuid-validator.middleware";

const makeController = (): MVCController => {
  const repository = new ScrapRepository();
  const cache = new CacheRepository();

  return new ScrapController(repository, cache);
};

export default class ScrapRoutes {
  public init(routes: Router) {
    routes.get(
      "/scraps",
      middlewareAdapter(new UserAuthMiddleware()),
      routerMvcAdapter(makeController(), EMVC.INDEX)
    );

    routes.get(
      "/scraps/:uid",
      [
        middlewareAdapter(new UserAuthMiddleware()),
        middlewareAdapter(new UuidValidatorMiddleware()),
      ],
      routerMvcAdapter(makeController(), EMVC.SHOW)
    );

    routes.post(
      "/scraps",
      [
        middlewareAdapter(new UserAuthMiddleware()),
        middlewareAdapter(new ScrapMiddleware()),
      ],
      routerMvcAdapter(makeController(), EMVC.STORE)
    );

    routes.put(
      "/scraps/:uid",
      [
        middlewareAdapter(new UserAuthMiddleware()),
        middlewareAdapter(new ScrapMiddleware()),
        middlewareAdapter(new UuidValidatorMiddleware()),
      ],
      routerMvcAdapter(makeController(), EMVC.UPDATE)
    );

    routes.delete(
      "/scraps/:uid",
      [
        middlewareAdapter(new UserAuthMiddleware()),
        middlewareAdapter(new UuidValidatorMiddleware()),
      ],
      routerMvcAdapter(makeController(), EMVC.DELETE)
    );
  }
}
