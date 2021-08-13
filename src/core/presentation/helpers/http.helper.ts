import {
  ConflictError,
  DataNotFoundError,
  ForbiddenError,
  ServerError,
  UnauthorizedError,
} from "../errors";
import { HttpResponse } from "../models";

export const ok = (body: any): HttpResponse => ({
  statusCode: 200,
  body,
});

export const badRequest = (error: any): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const notFound = (): HttpResponse => ({
  statusCode: 404,
  body: new DataNotFoundError(),
});

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(),
});

export const conflict = (error: string): HttpResponse => ({
  statusCode: 409,
  body: new ConflictError(error),
});

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
});

export const forbidden = (): HttpResponse => ({
  statusCode: 403,
  body: new ForbiddenError(),
});
