import type { Request, Response } from "express";
import { Controller } from "../Controller";
import { register } from "../../services/authentication";

export class RegisterController implements Controller {
    async invoke(req: Request, res: Response): Promise<void> {
        try {
            const { body, file } = req;

            if (file) {
                body.profilePicture = (file as any).location;
            }

            const user = await register(body);

            res.status(201).json({
                message: "User created successfully",
                data: user,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
