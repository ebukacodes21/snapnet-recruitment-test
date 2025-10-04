"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentModel = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = require("../../../database/database.config");
exports.DepartmentModel = database_config_1.database.define("departments", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
    freezeTableName: true,
});
