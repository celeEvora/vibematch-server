import express, { Express } from "express";
import { Server as HttpServer, createServer } from "http";
import ApiConfig from "./config/api.config";
import AppRouter from "./routes/appRouter";

export default class Server {
    private readonly app: Express;
    private readonly apiConfig: ApiConfig;
    private readonly httpServer: HttpServer;
    private readonly router: AppRouter;

    constructor(apiConfig: ApiConfig) {
        this.app = express();
        this.apiConfig = apiConfig;
        this.httpServer = createServer(this.app);
        this.router = new AppRouter();
        this.app.use(this.apiConfig.route(), this.router.getRouter());
    }

    async start(): Promise<void> {
        await this.listen();
    }

    async listen(): Promise<void> {
        return new Promise((resolve) => {
            this.httpServer.listen(this.apiConfig.port, () => {
                console.info(
                    `Server is running on port ${this.apiConfig.port}\n`
                );
                console.info("Press CTRL-C to stop\n");
                resolve();
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
