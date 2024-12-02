import { Express } from "express";
import { Controller } from "@/controllers/Controller";
import { authenticateToken } from "@/middlewares/authenticateToken";
import { ChatController } from "@/controllers/api/ChatController";
import { SendMessageController } from "@/controllers/api/SendMessageController";
import { MessagesController } from "@/controllers/api/MessagesController";

export const register = function (app: Express): void {
    const chatController: Controller = new ChatController();
    app.get(
        "/chats/:id",
        authenticateToken,
        chatController.invoke.bind(chatController)
    );

    const sendMessageController: Controller = new SendMessageController();
    app.post(
        "/send-message",
        authenticateToken,
        sendMessageController.invoke.bind(sendMessageController)
    );

    const messagesController: Controller = new MessagesController();
    app.get(
        "/chat/:id",
        authenticateToken,
        messagesController.invoke.bind(messagesController)
    );
};
