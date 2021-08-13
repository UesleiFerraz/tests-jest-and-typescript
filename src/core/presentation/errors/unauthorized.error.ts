export class UnauthorizedError extends Error {
  constructor() {
    super("you must authenticate first");
    this.name = "UnauthorizedError";
  }
}
