export class ForbiddenError extends Error {
  constructor() {
    super("password invalid");
    this.name = "ForbiddenError";
  }
}
