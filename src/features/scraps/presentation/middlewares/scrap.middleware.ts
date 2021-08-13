import {
  badRequest,
  HttpRequest,
  HttpResponse,
  ok,
  RequireFieldsValidator,
} from "../../../../core/presentation";
import { Scrap } from "../../domain";

export class ScrapMiddleware {
  private fields = ["title", "description"];

  public handle(request: HttpRequest): HttpResponse {
    const body: Scrap = request.body;

    for (const field of this.fields) {
      const error = new RequireFieldsValidator(field).validate(body);

      if (error) {
        return badRequest(error);
      }
    }

    return ok({});
  }
}
