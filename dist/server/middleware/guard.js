"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = isAuth;
exports.isAdmin = isAdmin;
exports.isManagement = isManagement;
const jwt_1 = require("../utils/jwt");
function isAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authorizationHeader = req.headers['Authorization'] || req.headers['authorization'];
            if (!authorizationHeader || typeof authorizationHeader !== 'string') {
                return res.status(401).json({ message: 'authorization header is missing or invalid' });
            }
            const token = authorizationHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'bearer token is missing or invalid authorization format' });
            }
            const payload = yield (0, jwt_1.verifyToken)(token);
            if (!payload) {
                return res.status(401).json({ message: 'invalid or expired token' });
            }
            res.locals = payload;
            next();
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'internal server error. please check the logs' });
        }
    });
}
function isAdmin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authorizationHeader = req.headers['Authorization'] || req.headers['authorization'];
            if (!authorizationHeader || typeof authorizationHeader !== 'string') {
                return res.status(401).json({ message: 'authorization header is missing or invalid' });
            }
            const token = authorizationHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'bearer token is missing or invalid authorization format' });
            }
            const payload = yield (0, jwt_1.verifyToken)(token);
            if (!payload) {
                return res.status(401).json({ message: 'invalid or expired token' });
            }
            if (!payload.isAdmin) {
                return res.status(403).json({ message: 'forbidden to perform request' });
            }
            res.locals = payload;
            next();
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'internal server error. please check the logs' });
        }
    });
}
function isManagement(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authorizationHeader = req.headers['Authorization'] || req.headers['authorization'];
            if (!authorizationHeader || typeof authorizationHeader !== 'string') {
                return res.status(401).json({ message: 'authorization header is missing or invalid' });
            }
            const token = authorizationHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'bearer token is missing or invalid authorization format' });
            }
            const payload = yield (0, jwt_1.verifyToken)(token);
            if (!payload) {
                return res.status(401).json({ message: 'invalid or expired token' });
            }
            if (!payload.isManagement) {
                return res.status(403).json({ message: 'forbidden to perform request' });
            }
            res.locals = payload;
            next();
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'internal server error. please check the logs' });
        }
    });
}
