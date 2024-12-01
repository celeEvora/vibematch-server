import { Express } from "express";
import { Controller } from "../../controllers/Controller";
import { CountriesController } from "../../controllers/api/CountriesController";

export const register = function (app: Express): void {
    const countriesController: Controller = new CountriesController();
    app.get("/countries", countriesController.invoke.bind(countriesController));
};
