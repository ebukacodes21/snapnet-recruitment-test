"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalizeWords = exports.calculateMonthlyPayment = void 0;
const calculateMonthlyPayment = (amount, term, interestRate) => {
    const totalInterest = amount * interestRate * term;
    const totalRepayment = amount + totalInterest;
    return totalRepayment / term;
};
exports.calculateMonthlyPayment = calculateMonthlyPayment;
const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
};
exports.capitalizeWords = capitalizeWords;
