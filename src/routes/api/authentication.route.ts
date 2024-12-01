import { Express } from "express";
import { Controller } from "../../controllers/Controller";
import { RegisterController } from "../../controllers/api/RegisterController";
import { MeController } from "@/controllers/api/MeController";
import uploadImage from "@/middlewares/uploadImage";
import { authenticateToken } from "@/middlewares/authenticateToken";
import { LoginController } from "@/controllers/api/LoginController";

export const register = function (app: Express): void {
    const registerController: Controller = new RegisterController();
    app.post(
        "/auth/register",
        uploadImage.single("profilePicture"),
        registerController.invoke.bind(registerController)
    );

    const loginController: Controller = new LoginController();
    app.post("/auth/login", loginController.invoke.bind(loginController));

    const meController: Controller = new MeController();
    app.get(
        "/auth/me",
        authenticateToken,
        meController.invoke.bind(meController)
    );
};
