import { Express } from "express";
import departmentApi from './api/department/route/department.route'
import employeeApi from './api/employee/route/employee.route'
import leaveApi from './api/leave/route/leave.route'
import healthApi from './api/health/route/health.route'
import * as amqp from "amqplib";

function routes(app: Express, channel: amqp.Channel) {
    app.use('/departments', departmentApi)
    app.use('/employees', employeeApi)
    app.use('/leaves', leaveApi(channel))
    app.use('/metrics', healthApi)
    app.use('*', (req, res) => res.status(404).json({ message: "route not found"}))
}

export default routes