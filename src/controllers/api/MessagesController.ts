import type { Request, Response } from "express";
import { Controller } from "../Controller";
import { getMessages } from "@/services/chat";

export class MessagesController implements Controller {
    async invoke(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const messages = await getMessages(Number(id));

            res.status(200).json({
                message: "Messages retrieved successfully",
                data: messages,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
