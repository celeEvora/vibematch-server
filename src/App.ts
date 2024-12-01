import { config } from "dotenv";
import ApiConfig from "../src/config/api.config";
import Server from "./Server";

export default class App {
    private readonly server: Server;

    constructor() {
        config();
        const apiConfig = new ApiConfig();
        this.server = new Server(apiConfig);
    }

    async start(): Promise<void> {
        return await this.server.start();
    }

    async stop(): Promise<void> {
        return await this.server.stop();
    }
}
