import UserController from "./controllers/user.ts";
import { Oak } from "./deps.ts";
import authMiddleware from "./middlewares/auth.ts";

const router = new Oak.Router();

router.get("/", (ctx) => {
  ctx.response.body = "Welcome to Deno!";
});

router
  .get("/users", authMiddleware, UserController.index)
  .post("/signup", UserController.signup)
  .post("/login", UserController.login);

export default function routes(app: Oak.Application) {
  app.use(router.routes());
  app.use(router.allowedMethods());
}