import {
  badRequest,
  HttpRequest,
  HttpResponse,
  InvalidParamError,
  ok,
} from "../../../../core/presentation";
import { validate } from "uuid";

export class UuidValidatorMiddleware {
  public handle(request: HttpRequest): HttpResponse {
    console.log(request);
    const { uid } = request.params;

    if (!validate(uid)) {
      return badRequest(new InvalidParamError("uid"));
    }

    return ok({});
  }
}
