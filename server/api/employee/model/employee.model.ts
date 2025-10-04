import { Model, Optional } from 'sequelize';
import sequelize from 'sequelize';
import { database } from '../../../database/database.config';

interface EmployeeAttributes {
    id: number;
    name: string;
    email: string;
    departmentId: number;
    role?: string;
}

export interface EmployeeCreationAttributes extends Optional<EmployeeAttributes, 'id'> {}
export interface EmployeeInstance extends Model<EmployeeAttributes, EmployeeCreationAttributes>, EmployeeAttributes {}

export const EmployeeModel = database.define<EmployeeInstance>('employees', {
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: sequelize.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    departmentId: {
        type: sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    role: {
        type: sequelize.DataTypes.STRING,
        allowNull: false,
        defaultValue: "employee"
    },
}, {
    timestamps: true, freezeTableName: true
});
