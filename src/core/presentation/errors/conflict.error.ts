export class ConflictError extends Error {
  constructor(paramName: string) {
    super(`${paramName} already exists`);
    this.name = "ConflictError";
  }
}
