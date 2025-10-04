import { Model, Optional } from 'sequelize';
import sequelize from 'sequelize';
import { database } from '../../../database/database.config';

interface LeaveAttributes {
    id: number;
    employeeId: number;
    startDate: Date;
    endDate?: Date;
    status: 'pending_approval' | 'approved';
}

export interface LeaveCreationAttributes extends Optional<LeaveAttributes, 'id'> {}
export interface LeaveInstance extends Model<LeaveAttributes, LeaveCreationAttributes>, LeaveAttributes {}

export const LeaveModel = database.define<LeaveInstance>('leaves', {
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    employeeId: {
        type: sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    startDate: {
        type: sequelize.DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: sequelize.DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: sequelize.DataTypes.ENUM('approved', 'pending_approval'),
        allowNull: false,
        defaultValue: 'pending_approval'
    }
}, {
    timestamps: true,
    freezeTableName: true
});
