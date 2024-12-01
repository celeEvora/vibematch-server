import type { Response } from "express";
import { Controller } from "../Controller";
import { getUserById } from "@/services/user";
import type { RequestWithUser } from "@/middlewares/authenticateToken";

export class UserController implements Controller {
    async invoke(req: RequestWithUser, res: Response): Promise<void> {
        try {
            const userId = Number(req.params.id);

            if (!userId) {
                res.status(400).json({ error: "Invalid user id" });
                return;
            }

            const user = await getUserById(userId);

            res.status(200).json({
                message: "User retrieved successfully",
                data: user,
            });
        } catch (error: any) {
            console.error("Error in UserController:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
