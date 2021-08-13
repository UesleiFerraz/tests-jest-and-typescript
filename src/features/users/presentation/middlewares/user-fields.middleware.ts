import {
  badRequest,
  HttpRequest,
  HttpResponse,
  ok,
  RequireFieldsValidator,
} from "../../../scraps/presentation";
import { User } from "../../domain";

export class UserFieldsMiddleware {
  private fields = ["username", "password"];

  public handle(request: HttpRequest): HttpResponse {
    const body: User = request.body;

    for (const field of this.fields) {
      const error = new RequireFieldsValidator(field).validate(body);

      if (error) {
        return badRequest(error);
      }
    }

    return ok({});
  }
}
