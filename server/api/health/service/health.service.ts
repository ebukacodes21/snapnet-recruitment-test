import {database} from '../../../database/database.config'
import { checkRabbitMQHealth } from "../../../utils/rabbitmq";
import { AppError } from "../../../utils/appError";

export class HealthService {
  static async checkSystem() {
    return { status: "OK", timestamp: new Date().toISOString() };
  }

  static async checkDatabase() {
    try {
      await database.authenticate();
      return { status: "OK", message: "database connected" };
    } catch (error: any) {
      return { status: "ERROR", message: error.message };
    }
  }

  static async checkQueue() {
    try {
      const conn = await checkRabbitMQHealth();
      if (conn.status != "OK") throw new AppError("rabbitmq not connected", 500);
      return conn;
    } catch (error: any) {
      return { status: "ERROR", message: error.message };
    }
  }
}
