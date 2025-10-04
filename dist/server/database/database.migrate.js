"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = void 0;
const path_1 = __importDefault(require("path"));
const sequelize_1 = require("sequelize");
const umzug_1 = require("umzug");
const runMigrations = async (sequelize) => {
    const umzug = new umzug_1.Umzug({
        migrations: {
            glob: path_1.default.join(__dirname, "../../migrations/*.js"),
            resolve: ({ name, path, context }) => {
                const migration = require(path);
                return {
                    name,
                    up: () => migration.up(context, sequelize_1.Sequelize),
                    down: () => migration.down(context, sequelize_1.Sequelize),
                };
            },
        },
        context: sequelize.getQueryInterface(),
        storage: new umzug_1.SequelizeStorage({ sequelize }),
        logger: console,
    });
    const result = await umzug.up();
    console.log("migrations applied:", result.map((m) => m.name));
};
exports.runMigrations = runMigrations;
