"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentRepository = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const department_model_1 = require("../models/department.model");
dotenv_1.default.config();
class DepartmentRepository {
    async CreateDepartment(data) {
        return await department_model_1.DepartmentModel.create(data);
    }
    async FindDepartmentByPK(id) {
        return department_model_1.DepartmentModel.findByPk(id);
    }
}
exports.DepartmentRepository = DepartmentRepository;
