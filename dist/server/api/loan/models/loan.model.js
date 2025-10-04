"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanModel = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = require("../../../database/database.config");
exports.LoanModel = database_config_1.database.define("loan", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    loanType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    interestRate: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    monthlyAmount: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    monthlyInterest: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    totalInterest: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    adminFee: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    totalRepayment: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    totalRepaid: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    totalUnpaid: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    months: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    numberOfRepayments: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    dueDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    collateral: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    accountHolder: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    guarantorName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    guarantorEmail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    guarantorPhone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    guarantorIppisNo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    bankName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    accountNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    bvn: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    occupation: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    employerAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    employerName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    employerPhone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    yourIppisNo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    statement: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    adminFeeReceipt: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    collateralDocument: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    loanInterest: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    borrower: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    nextPaymentDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    approvedDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: true,
    freezeTableName: true,
});
