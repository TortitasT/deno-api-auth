import Database from "../database.ts";
import { Bcrypt, Jwt, Oak, Validasaur } from "../deps.ts";
import UserResource from "../resources/user.ts";
import { key } from "../utils/apiKey.ts";

export default class UserController {
  public static async signup(ctx: Oak.Context) {
    const body = await ctx.request.body().value;

    const [passes, errors] = await Validasaur.validate(body, {
      username: Validasaur.required,
      password: Validasaur.required,
      password_confirmation: [Validasaur.required, Validasaur.isIn([body.password])],
    });

    if (!passes) {
      ctx.response.status = 422;

      ctx.response.body = {
        errors,
      };

      return;
    }

    const { username, password } = body;

    Database.insertUser(
      username,
      Bcrypt.hashSync(password),
    );

    const user = Database.selectUser(username)[0];

    ctx.response.body = new UserResource(user);
  }

  public static async login(ctx: Oak.Context) {
    const body = await ctx.request.body().value;

    const [passes, errors] = await Validasaur.validate(body, {
      username: Validasaur.required,
      password: Validasaur.required,
    });

    if (!passes) {
      ctx.response.status = 422;

      ctx.response.body = {
        errors,
      };

      return;
    }

    const { username, password } = body;

    const user = Database.selectUser(username)[0];

    if (!user) {
      ctx.response.status = 422;

      ctx.response.body = {
        errors: {
          username: ["Username does not exist"],
        },
      };

      return;
    }

    if (!Bcrypt.compareSync(password, user.password)) {
      ctx.response.status = 422;

      ctx.response.body = {
        errors: {
          password: ["Password is incorrect"],
        },
      };

      return;
    }

    const userResource = new UserResource(user);

    const jwt = await Jwt.create({ alg: "HS512", typ: "JWT" }, { userResource }, key);

    if (!jwt) {
      ctx.response.status = 500;

      ctx.response.body = {
        errors: {
          jwt: ["Failed to create JWT"],
        },
      };

      return;
    }

    userResource.token = jwt;

    ctx.response.body = userResource;
  }

  public static index(ctx: Oak.Context) {
    const users = Database.selectUsers();

    ctx.response.body = users.map((user: any) => new UserResource(user));
  }
}