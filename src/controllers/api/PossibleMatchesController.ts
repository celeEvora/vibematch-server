import type { Request, Response } from "express";
import { Controller } from "../Controller";
import { getPossibleMatches } from "@/services/matches";

export class PossibleMatchesController implements Controller {
    async invoke(req: Request, res: Response): Promise<void> {
        try {
            const userId = Number(req.params?.id);

            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const matches = await getPossibleMatches(userId);

            res.status(200).json({
                message: "Possible matches retrieved successfully",
                data: matches,
            });
        } catch (error: any) {
            console.error("Error in PossibleMatchesController:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
