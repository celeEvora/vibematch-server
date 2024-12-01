import type { Request, Response } from "express";
import { Controller } from "../Controller";
import { getLikesForUser } from "@/services/matches";

export class LikesForUserController implements Controller {
    async invoke(req: Request, res: Response): Promise<void> {
        try {
            const { params } = req;
            const { id } = params;

            const likes = await getLikesForUser(Number(id));

            res.status(200).json({
                message: "Likes retrieved successfully",
                data: likes,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
