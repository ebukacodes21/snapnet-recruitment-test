import express from "express";
import { HealthController } from "../controller/health.controller";

export default express.Router()
    .get("/system-health", (req, res) => HealthController.systemHealth(req, res))
    .get("/database-health", (req, res) => HealthController.dbHealth(req, res))
    .get("/queue-health", (req, res) => HealthController.queueHealth(req, res))