"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./common/server");
const routes_1 = __importDefault(require("./routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const server = new server_1.Server();
const port = process.env.PORT;
server.configureDb()
    .then(() => {
    server.router(routes_1.default);
    server.listen(Number(port));
})
    .catch((error) => {
    console.log(error);
    throw error;
});
exports.default = server;
