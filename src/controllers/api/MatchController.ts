import type { Request, Response } from "express";
import { Controller } from "../Controller";
import { getMatchesForUser } from "@/services/matches";

export class MatchesForUserController implements Controller {
    async invoke(req: Request, res: Response): Promise<void> {
        try {
            const { params } = req;
            const { id } = params;

            const matches = await getMatchesForUser(Number(id));

            res.status(200).json({
                message: "Matches retrieved successfully",
                data: matches,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
