import type { Request, Response } from "express";
import { Controller } from "../Controller";
import { sendMessage } from "@/services/chat";

export class SendMessageController implements Controller {
    async invoke(req: Request, res: Response): Promise<void> {
        try {
            const { body } = req;
            const { senderId, receiverId, content } = body;

            const message = await sendMessage(senderId, receiverId, content);

            res.status(200).json({
                message: "Message sent successfully",
                data: message,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
