import express, { Express } from "express";
import { Server as HttpServer, createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import ApiConfig from "./config/api.config";
import AppRouter from "./routes/appRouter";
import { getMessages, sendMessage } from "@/services/chat";

export default class Server {
    private readonly app: Express;
    private readonly apiConfig: ApiConfig;
    private readonly httpServer: HttpServer;
    private readonly router: AppRouter;
    private readonly io: SocketIOServer;

    constructor(apiConfig: ApiConfig) {
        if (!apiConfig.port) {
            throw new Error("El puerto no está definido en ApiConfig.");
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
            socket.on("disconect", () => {
                console.log("Usuario desconectado");
            });

            socket.on("load_messages", async (chatId) => {
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
                    socket.emit("load_messages", formattedMessages);
                } catch (error) {
                    console.error("Error al cargar mensajes:", error);
                }
            });

            socket.on("chat_message", async (msg) => {
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

                    this.io.emit("chat_message", formattedMessage);
                } catch (error: any) {
                    console.error("Error al enviar mensaje:", error);
                }
            });
        });
    }

    async start(): Promise<void> {
        await this.listen();
    }

    async listen(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.httpServer
                .listen(this.apiConfig.port, () => {
                    console.info(
                        `Server is running on port ${this.apiConfig.port}\n`
                    );
                    console.info("Press CTRL-C to stop\n");
                    resolve();
                })
                .on("error", (error) => {
                    console.error("Error al iniciar el servidor:", error);
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
