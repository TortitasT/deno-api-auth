import { Oak } from "../deps.ts";

/*
* Add a listening event to the app to log the hostname and port
*/
export default function serverInfo(app: Oak.Application) {
  app.addEventListener("listen", ({ hostname, port, secure }) => {
    console.log(
      `Listening on: ${secure ? "https://" : "http://"}${hostname === "0.0.0.0" && hostname !== null ?
        "localhost" : hostname
      }:${port}`,
    );
  });
}