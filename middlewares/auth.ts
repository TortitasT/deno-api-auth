import { Jwt, Oak } from "../deps.ts";
import { key } from "../utils/apiKey.ts";

export default async function authMiddleware(ctx: Oak.Context, next: any) {
  const headers: Headers = ctx.request.headers;

  const authorization = headers.get('Authorization');

  if (!authorization) {
    ctx.response.status = 401;

    ctx.response.body = {
      errors: {
        message: "Unauthorized"
      }
    };

    return;
  }

  const jwt = authorization.split(' ')[1];

  if (!jwt) {
    ctx.response.status = 401;

    ctx.response.body = {
      errors: {
        message: "Unauthorized"
      }
    };

    return;
  }


  const payload = await Jwt.verify(jwt, key).catch(() => null);

  if (!payload) {
    ctx.response.status = 401;

    ctx.response.body = {
      errors: {
        message: "Unauthorized"
      }
    };

    return;
  }

  console.log(payload);

  await next();
}