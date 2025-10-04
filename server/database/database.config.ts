import sequelize from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

export const database = new sequelize.Sequelize(process.env.DATABASE_NAME!, process.env.DATABASE_USER!, process.env.DATABASE_PASSWORD!, {
    dialect: "mysql",
    storage: "./database.mysql",
    logging: false,
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT)
});