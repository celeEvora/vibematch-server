export default class ApiConfig {
    private readonly prefix: string;
    private readonly version: string;
    readonly appURL: string;
    readonly port: string | number;

    constructor(prefix: string = "api", version: string = "v1") {
        this.prefix = process.env.API_PREFIX || prefix;
        this.version = process.env.API_VERSION || version;
        this.appURL = process.env.APP_URL || "0.0.0.0";
        this.port = process.env.PORT || 3000;
    }

    route(): string {
        return `${this.prefix}/${this.version}`;
    }
}
