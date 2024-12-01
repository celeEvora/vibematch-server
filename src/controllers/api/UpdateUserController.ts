import type { Request, Response } from "express";
import { Controller } from "../Controller";
import { updateUser } from "@/services/user";

export class UpdateUserController implements Controller {
    async invoke(req: Request, res: Response): Promise<void> {
        try {
            const { body, params } = req;
            const { id } = params;

            const updatedUser = await updateUser(Number(id), body);

            res.status(200).json({
                message: "User updated successfully",
                data: updatedUser,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
