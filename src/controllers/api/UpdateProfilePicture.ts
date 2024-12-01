import type { Request, Response } from "express";
import { Controller } from "../Controller";
import { updateProfilePicture } from "@/services/user";

export class UpdateProfilePictureController implements Controller {
    async invoke(req: Request, res: Response): Promise<void> {
        try {
            const { body, file, params } = req;
            const { id } = params;

            if (file) {
                body.profilePicture = (file as any).location;
            }

            const user = await updateProfilePicture(
                Number(id),
                body.profilePicture
            );

            res.status(200).json({
                message: "Profile picture updated successfully",
                data: user,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
