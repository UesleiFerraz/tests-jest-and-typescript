export interface HttpResponse {
  statusCode: number;
  body: any;
}

export interface HttpRequest {
  params: any;
  body: any;
}

export interface HttpMiddleware {
  headers: any;
  body: any;
  params?: any;
  userUid?: string;
}
