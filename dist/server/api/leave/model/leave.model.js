"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveModel = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const database_config_1 = require("../../../database/database.config");
exports.LeaveModel = database_config_1.database.define('leaves', {
    id: {
        type: sequelize_1.default.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    employeeId: {
        type: sequelize_1.default.DataTypes.INTEGER,
        allowNull: false,
    },
    startDate: {
        type: sequelize_1.default.DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: sequelize_1.default.DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: sequelize_1.default.DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
    }
}, {
    timestamps: true,
    freezeTableName: true
});
