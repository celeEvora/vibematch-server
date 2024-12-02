import type { Request, Response } from "express";
import { Controller } from "../Controller";
import { getChats } from "@/services/chat";

export class ChatController implements Controller {
    async invoke(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const chats = await getChats(Number(id));

            res.status(200).json({
                message: "Chats retrieved successfully",
                data: chats,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
