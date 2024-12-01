import jwt from "jsonwebtoken";
import JWTConfig from "@/config/jwt.config";

export default function JWTManager() {
    const jwtConfig = new JWTConfig();

    return {
        generate: (
            data: string | Buffer | object
        ): {
            accessToken: string;
            expiresIn: number | string;
        } => {
            const accessToken = jwt.sign(data, jwtConfig.secret, {
                expiresIn: jwtConfig.expiresIn,
            });

            return {
                accessToken,
                expiresIn: jwtConfig.expiresIn,
            };
        },

        verify: (token: string): string | object => {
            return jwt.verify(token, jwtConfig.secret);
        },
    };
}
