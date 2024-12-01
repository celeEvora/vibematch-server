import { Express } from "express";
import { Controller } from "../../controllers/Controller";
import { UpdateUserController } from "@/controllers/api/UpdateUserController";
import { UpdateProfilePictureController } from "@/controllers/api/UpdateProfilePicture";
import { authenticateToken } from "@/middlewares/authenticateToken";
import uploadImage from "@/middlewares/uploadImage";
import { UserController } from "@/controllers/api/UserController";

export const register = function (app: Express): void {
    const userController: Controller = new UserController();
    app.get(
        "/user/:id",
        authenticateToken,
        userController.invoke.bind(userController)
    );

    const updateUserController: Controller = new UpdateUserController();
    app.patch(
        "/user/:id",
        authenticateToken,
        updateUserController.invoke.bind(updateUserController)
    );

    const updateProfilePictureController: Controller =
        new UpdateProfilePictureController();
    app.patch(
        "/user/:id/profile-picture",
        authenticateToken,
        uploadImage.single("profilePicture"),
        updateProfilePictureController.invoke.bind(
            updateProfilePictureController
        )
    );
};
