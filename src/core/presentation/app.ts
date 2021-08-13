import cors from "cors";
import express, { Request, Response, Router } from "express";
import ScrapRoutes from "../../features/scraps/presentation/routes/routes";
import UserRoutes from "../../features/users/presentation/routes/routes";

export default class App {
  readonly #express: express.Application;

  constructor() {
    this.#express = express();
  }

  public get server(): express.Application {
    return this.#express;
  }

  public init() {
    this.config();
    this.routes();
  }

  private config() {
    this.#express.use(cors());
    this.#express.use(express.urlencoded({ extended: false }));
    this.#express.use(express.json());
  }

  private routes() {
    const router = Router();

    this.#express.get("/", (_: Request, response: Response) => {
      return response.redirect("/api");
    });

    this.#express.use("/api", router);

    router.get("/", (_: Request, response: Response) => {
      return response.json({ message: "Welcome to the API!" });
    });

    new ScrapRoutes().init(router);
    new UserRoutes().init(router);
  }

  public start(port: number) {
    this.#express.listen(port, () => {
      console.log(`🔥 Server started at http://localhost:${port}`);
    });
  }
}
