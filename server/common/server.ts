import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { database } from "../database/database.config";
import { runMigrations } from "../database/database.migrate";
import { CreateChannel } from "../utils/rabbitmq";

const app = express();
const server = new http.Server(app);

export class Server {
  constructor() {
    app.use(express.json());
    app.use(
      express.urlencoded({
        extended: true,
      })
    );
    app.use(morgan("dev"));
    app.use(
      helmet.contentSecurityPolicy({
        reportOnly: true,
      })
    );
    app.use(
      cors({
        allowedHeaders: ["Content-Type", "token", "authorization"],
        exposedHeaders: ["token", "authorization"],
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
      })
    );
  }

  async router(routes: Function) {
    const channel = await CreateChannel()
    routes(app, channel);
    return this;
  }

  configureDb() {
    return new Promise(async (resolve, reject) => {
      try {
        await database.authenticate();
        console.log("database authenticated.");

        await runMigrations(database);
        console.log("migrations completed.");
        return resolve(this);
      } catch (error) {
        console.error("database connection or migration error:", error);
        return reject(error);
      }
    });
  }

  listen(port: number) {
    server.listen(port, () => {
      console.log(`server is listening on port: ${port}`);
    });
    return app;
  }
}
