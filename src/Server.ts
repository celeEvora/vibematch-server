import express, { Express } from "express";
import { Server as HttpServer, createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import ApiConfig from "./config/api.config";
import AppRouter from "./routes/appRouter";
import { getMessages, sendMessage } from "@/services/chat";
import { likeUser } from "./services/matches";
import os from "os";

export default class Server {
    private readonly app: Express;
    private readonly apiConfig: ApiConfig;
    private readonly httpServer: HttpServer;
    private readonly router: AppRouter;
    private readonly io: SocketIOServer;

    constructor(apiConfig: ApiConfig) {
        if (!apiConfig.port) {
            throw new Error("The port is not defined in ApiConfig.");
        }

        this.app = express();
        this.apiConfig = apiConfig;
        this.httpServer = createServer(this.app);
        this.router = new AppRouter();

        this.io = new SocketIOServer(this.httpServer, {
            cors: {
                origin: "*",
            },
        });

        this.app.use(this.apiConfig.route(), this.router.getRouter());

        this.setupWebSocketHandlers();
    }

    private setupWebSocketHandlers(): void {
        this.io.on("connection", (socket) => {
            console.log("User connected:", socket.id);

            socket.on("register_user", (userId) => {
                const userRoom = `user:${userId}`;
                socket.join(userRoom);
                console.log(`User ${userId} joined room ${userRoom}`);
            });

            socket.on("like_user", async ({ fromUserId, toUserId, isLike }) => {
                try {
                    const result = await likeUser(fromUserId, toUserId, isLike);

                    const userRoom = `user:${toUserId}`;
                    if (isLike === true) {
                        socket.to(userRoom).emit("like_notification", {
                            fromUserId,
                            message: "Someone liked you!",
                        });
                    }

                    socket.emit("like_user_response", {
                        success: true,
                        result,
                    });
                } catch (error) {
                    console.error("Error when liking user:", error);
                    socket.emit("like_user_response", {
                        success: false,
                        error: (error as any).message,
                    });
                }
            });

            // Join a specific chat room
            socket.on(
                "load_messages",
                async ({ chatId, senderId, receiverId }) => {
                    // const chatRoom = `chat:${chatId}`;
                    const chatRoom = this.getRoomId(senderId, receiverId);

                    socket.join(chatRoom);
                    console.log(`Socket ${socket.id} joined room ${chatRoom}`);

                    try {
                        const messages = await getMessages(chatId);
                        const formattedMessages = messages.map((message) => ({
                            _id: message.id,
                            text: message.content,
                            createdAt: message.createdAt,
                            user: {
                                _id: message.senderId,
                                name: `${message.sender.firstName} ${message.sender.lastName}`,
                                avatar: message.sender.profilePicture,
                            },
                        }));

                        // Send messages only to the user who requested them
                        socket.emit("load_messages", formattedMessages);
                    } catch (error) {
                        console.error("Error when loading messages:", error);
                    }
                }
            );

            // Handle sending a chat message
            socket.on("chat_message", async (msg) => {
                // const chatRoom = `chat:${msg.chatId}`;
                const chatRoom = this.getRoomId(msg.senderId, msg.receiverId);

                console.log(
                    `Message from ${msg.senderId} to chat room ${chatRoom}: ${msg.content}`
                );

                try {
                    const message = await sendMessage(
                        msg.senderId,
                        msg.receiverId,
                        msg.content
                    );

                    const formattedMessage = {
                        _id: message.id,
                        text: message.content,
                        createdAt: message.createdAt,
                        user: {
                            _id: message.senderId,
                            name: `${message.sender.firstName} ${message.sender.lastName}`,
                            avatar: message.sender.profilePicture,
                        },
                    };

                    // Emit the message to the chat room
                    this.io.to(chatRoom).emit("chat_message", formattedMessage);

                    // Emit a notification to the receiver
                    const receiverRoom = `user:${msg.receiverId}`;
                    this.io.to(receiverRoom).emit("message_notification", {
                        fromUserId: msg.senderId,
                        content: msg.content,
                        createdAt: message.createdAt,
                    });

                    // Notify both users to update their chat list
                    const senderRoom = `user:${msg.senderId}`;
                    // const receiverRoom = `user:${msg.receiverId}`;
                    this.io
                        .to(senderRoom)
                        .to(receiverRoom)
                        .emit("chat_updated", {
                            chatId: msg.chatId,
                            lastMessage: formattedMessage,
                        });
                } catch (error) {
                    console.error("Error when sending message:", error);
                }
            });
        });
    }

    private getRoomId(userId1: string, userId2: string): string {
        return [userId1, userId2].sort().join(":");
    }

    async start(): Promise<void> {
        await this.listen();
    }

    async listen(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.httpServer
                .listen(this.apiConfig.port, () => {
                    const interfaces = os.networkInterfaces();
                    const address =
                        interfaces["en0"]?.find((x) => x.family === "IPv4")
                            ?.address || "192.168.0.3";
                    console.info(
                        // `Server is running on port ${this.apiConfig.port}\n`
                        `Server is running on http://${address}:${this.apiConfig.port}`
                    );
                    console.info("Press CTRL-C to stop\n");
                    resolve();
                })
                .on("error", (error) => {
                    console.error("Error when starting server:", error);
                    reject(error);
                });
        });
    }

    async stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.httpServer.close((error) => {
                if (error) {
                    return reject(error);
                }
                return resolve();
            });
        });
    }
}
