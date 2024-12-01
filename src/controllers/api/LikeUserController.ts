import type { Request, Response } from "express";
import { Controller } from "../Controller";
import { likeUser } from "@/services/matches";

export class LikeUserController implements Controller {
    async invoke(req: Request, res: Response): Promise<void> {
        try {
            const { body } = req;
            const { fromUserId, toUserId, isLike } = body;

            const like = await likeUser(fromUserId, toUserId, isLike);

            res.status(200).json({
                message: "Like added successfully",
                data: like,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
