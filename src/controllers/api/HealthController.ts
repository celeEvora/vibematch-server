import type { Request, Response } from "express";
import { Controller } from "../Controller";

// TODO: implement httpStatus library
export class HealthController implements Controller {
    async invoke(_: Request, res: Response): Promise<void> {
        res.status(200).json({ message: "Server is running great" });
    }
}
