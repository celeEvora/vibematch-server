import { Express } from "express";
import { Controller } from "../../controllers/Controller";
import { HealthController } from "../../controllers/api/healthController";

export const register = function (app: Express): void {
    const healthController: Controller = new HealthController();
    app.get("/health", healthController.invoke.bind(healthController));
};
