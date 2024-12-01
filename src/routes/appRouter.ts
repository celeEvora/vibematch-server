import express, { NextFunction, Request, Response, Router } from "express";
import { sync } from "glob";
import cors from "cors";
import helmet from "helmet";

export default class AppRouter {
    private readonly router: Router;

    constructor() {
        this.router = Router();
        this.router.use(cors());

        this.router.use(
            (
                error: Error,
                _req: Request,
                res: Response,
                _next: NextFunction
            ) => {
                console.error(error);
                res.status(500).send(error.message);
            }
        );

        this.router.use(express.json());
        this.router.use(express.urlencoded({ extended: true }));
        this.router.use(helmet.xssFilter());
        this.router.use(helmet.noSniff());
        this.router.use(helmet.hidePoweredBy());
        this.router.use(helmet.frameguard({ action: "deny" }));
        this.registerRoutes();
    }

    public getRouter(): Router {
        return this.router;
    }

    private registerRoutes(): void {
        const routes = sync(`${__dirname}/**/*.route.*`);
        routes.forEach((route) => this.register(route));
    }

    private register(route: string): void {
        const routeModule = require(route);
        routeModule.register(this.router);
    }
}
