"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const database_config_1 = require("../database/database.config");
const database_migrate_1 = require("../database/database.migrate");
const rabbitmq_1 = require("../utils/rabbitmq");
const app = (0, express_1.default)();
const server = new http_1.default.Server(app);
class Server {
    constructor() {
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({
            extended: true,
        }));
        app.use((0, morgan_1.default)("dev"));
        app.use(helmet_1.default.contentSecurityPolicy({
            reportOnly: true,
        }));
        app.use((0, cors_1.default)({
            allowedHeaders: ["Content-Type", "token", "authorization"],
            exposedHeaders: ["token", "authorization"],
            origin: "*",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            preflightContinue: false,
        }));
    }
    async router(routes) {
        const channel = await (0, rabbitmq_1.CreateChannel)();
        routes(app, channel);
        return this;
    }
    configureDb() {
        return new Promise(async (resolve, reject) => {
            try {
                await database_config_1.database.authenticate();
                console.log("database authenticated.");
                await (0, database_migrate_1.runMigrations)(database_config_1.database);
                console.log("migrations completed.");
                return resolve(this);
            }
            catch (error) {
                console.error("database connection or migration error:", error);
                return reject(error);
            }
        });
    }
    listen(port) {
        server.listen(port, () => {
            console.log(`server is listening on port: ${port}`);
        });
        return app;
    }
}
exports.Server = Server;
