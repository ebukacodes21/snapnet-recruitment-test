"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const department_route_1 = __importDefault(require("./api/department/routes/department.route"));
const employee_routes_1 = __importDefault(require("./api/employee/routes/employee.routes"));
const leave_routes_1 = __importDefault(require("./api/leave/routes/leave.routes"));
function routes(app, channel) {
    app.use('/departments', department_route_1.default);
    app.use('/employees', employee_routes_1.default);
    app.use('/leaves', (0, leave_routes_1.default)(channel));
    app.use('*', (req, res) => res.status(404).json({ message: "route not found" }));
}
exports.default = routes;
