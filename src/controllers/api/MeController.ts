import type { Response } from "express";
import { Controller } from "../Controller";
import { me } from "../../services/authentication";
import type { RequestWithUser } from "@/middlewares/authenticateToken";

export class MeController implements Controller {
    async invoke(req: RequestWithUser, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const user = await me(userId);

            res.status(200).json({
                message: "User retrieved successfully",
                data: user,
            });
        } catch (error: any) {
            console.error("Error in MeController:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
