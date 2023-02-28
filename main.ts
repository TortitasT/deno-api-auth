import Database from "./database.ts";
import { Oak } from "./deps.ts";
import routes from "./routes.ts";
import serverInfo from "./utils/serverInfo.ts";

await main();

async function main() {
  const app = new Oak.Application();

  serverInfo(app);

  Database.init();

  routes(app);

  await app.listen({ port: 8000 });
}

