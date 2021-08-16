import {
  HttpMiddleware,
  HttpResponse,
  ok,
  unauthorized,
} from "../../../../core/presentation";
import jwt from "jsonwebtoken";

interface IPayLoad {
  uid: string;
  iat: number;
  exp: number;
}

export class UserAuthMiddleware {
  public handle(request: HttpMiddleware): HttpResponse {
    try {
      const token = request.headers["authorization"]
        ?.replace("Bearer", "")
        .trim();
      if (!token) {
        return unauthorized();
      }

      const secret = process.env.JWT_SECRET || "123";

      const data = jwt.verify(token, secret);
      const { uid } = data as IPayLoad;

      return ok({ userUid: uid });
    } catch {
      return unauthorized();
    }
  }
}
