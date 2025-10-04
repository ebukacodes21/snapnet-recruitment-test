"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeModel = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const database_config_1 = require("../../../database/database.config");
exports.EmployeeModel = database_config_1.database.define('employees', {
    id: {
        type: sequelize_1.default.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.default.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.default.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    departmentId: {
        type: sequelize_1.default.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true, freezeTableName: true
});
