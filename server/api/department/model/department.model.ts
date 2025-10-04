import { Model, Optional, DataTypes } from "sequelize";
import { database } from "../../../database/database.config";

interface DepartmentAttributes {
  id?: number;
  name: string;
}

export interface DepartmentCreationAttributes
  extends Optional<DepartmentAttributes, "id"> {}

export interface DepartmentInstance
  extends Model<DepartmentAttributes, DepartmentCreationAttributes>,
    DepartmentAttributes {}

export const DepartmentModel = database.define<DepartmentInstance>(
  "departments",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);
