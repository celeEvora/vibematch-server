import { Request, Response, NextFunction } from "express";
import JWTManager from "@/helpers/jwt.manager";

const jwtManager = JWTManager();

interface IDecode {
    id: number;
    email: string;
}

export interface RequestWithUser extends Request {
    user?: IDecode;
}

export function authenticateToken(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        // Ensure the verify method returns IDecode
        const decodedToken = jwtManager.verify(token) as IDecode;

        // Check that the decoded token contains the necessary fields
        if (!decodedToken.id || !decodedToken.email) {
            res.status(403).json({ error: "Invalid token structure" });
            return;
        }

        req.user = decodedToken; // Attach the decoded token to req.user
        next();
        // } catch (error) {
        //     console.error("Token verification error:", error); // Log the error for debugging
        //     return res.status(403).json({ error: "Invalid or expired token" });
        // }
    } catch (error: any) {
        console.error("Token verification error:", error);

        if (error.name === "TokenExpiredError") {
            res.status(401).json({ error: "Token expired" });
        } else {
            res.status(403).json({ error: "Invalid or expired token" });
        }
    }
}
