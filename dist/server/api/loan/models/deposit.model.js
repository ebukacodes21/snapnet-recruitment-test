"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositModel = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = require("../../../database/database.config");
const uuid_1 = require("uuid");
exports.DepositModel = database_config_1.database.define("deposit", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    txId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: (0, uuid_1.v4)()
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    months: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    amount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    receipt: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    loanId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
    freezeTableName: true,
});
