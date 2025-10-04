import { DepartmentInput } from "../../../schema/department.schema";
import dotenv from "dotenv";
import { DepartmentModel } from "../model/department.model";
dotenv.config();

export class DepartmentRepository {
  async CreateDepartment(data: DepartmentInput) {
    return await DepartmentModel.create(data);
  }

  async FindDepartmentByPK(id: number) {
    return DepartmentModel.findByPk(id);
  }
}
