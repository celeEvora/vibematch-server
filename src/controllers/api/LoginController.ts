import type { Request, Response } from "express";
import { Controller } from "../Controller";
import { login } from "@/services/authentication";

export class LoginController implements Controller {
    async invoke(req: Request, res: Response): Promise<void> {
        try {
            const { body } = req;

            const user = await login(body);

            res.status(200).json({
                message: "User logged in successfully",
                data: user,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
