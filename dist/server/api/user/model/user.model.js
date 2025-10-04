"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.privateFields = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const database_config_1 = require("../../../database/database.config");
exports.privateFields = ["password", "verificationCode"];
exports.UserModel = database_config_1.database.define('user', {
    id: {
        type: sequelize_1.default.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    email: {
        type: sequelize_1.default.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: sequelize_1.default.DataTypes.STRING,
        allowNull: false,
    },
    emailVerified: {
        type: sequelize_1.default.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isAdmin: {
        type: sequelize_1.default.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isManagement: {
        type: sequelize_1.default.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    verificationCode: {
        type: sequelize_1.default.DataTypes.STRING,
        allowNull: false,
        defaultValue: () => Math.floor(Math.random() * 100000)
    },
    accountEnabled: {
        type: sequelize_1.default.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    lastLogin: {
        type: sequelize_1.default.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    },
    firstName: {
        type: sequelize_1.default.DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.default.DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: sequelize_1.default.DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: sequelize_1.default.DataTypes.STRING,
        allowNull: false,
    },
    zipCode: {
        type: sequelize_1.default.DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: sequelize_1.default.DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: sequelize_1.default.DataTypes.STRING,
        allowNull: false,
    },
    maritalStatus: {
        type: sequelize_1.default.DataTypes.STRING,
        allowNull: false,
    },
    aboutUs: {
        type: sequelize_1.default.DataTypes.STRING,
        allowNull: false,
    },
    phone1: {
        type: sequelize_1.default.DataTypes.STRING,
        allowNull: false,
    },
    phone2: {
        type: sequelize_1.default.DataTypes.STRING,
        allowNull: false,
    },
    occupation: {
        type: sequelize_1.default.DataTypes.STRING,
        allowNull: false,
    },
    imgUrl: {
        type: sequelize_1.default.DataTypes.STRING,
        allowNull: false,
        defaultValue: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp"
    }
}, {
    timestamps: true, freezeTableName: true
});
