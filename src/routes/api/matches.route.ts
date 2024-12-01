import { Express } from "express";
import { Controller } from "@/controllers/Controller";
import { PossibleMatchesController } from "@/controllers/api/PossibleMatchesController";
import { authenticateToken } from "@/middlewares/authenticateToken";
import { LikeUserController } from "@/controllers/api/LikeUserController";
import { MatchesForUserController } from "@/controllers/api/MatchController";
import { LikesForUserController } from "@/controllers/api/LikesForUserController";

export const register = function (app: Express): void {
    const possibleMatchesController: Controller =
        new PossibleMatchesController();
    app.get(
        "/possible-matches/:id",
        authenticateToken,
        possibleMatchesController.invoke.bind(possibleMatchesController)
    );

    const likeUserController: Controller = new LikeUserController();
    app.post(
        "/like",
        authenticateToken,
        likeUserController.invoke.bind(likeUserController)
    );

    const matchesForUserController: Controller = new MatchesForUserController();
    app.get(
        "/matches/:id",
        authenticateToken,
        matchesForUserController.invoke.bind(matchesForUserController)
    );

    const likesForUserController: Controller = new LikesForUserController();
    app.get(
        "/likes/:id",
        authenticateToken,
        likesForUserController.invoke.bind(likesForUserController)
    );
};
