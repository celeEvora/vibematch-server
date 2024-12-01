import type { Request, Response } from "express";
import { Controller } from "../Controller";
import { getCountries } from "../../services/countries";

export class CountriesController implements Controller {
    async invoke(req: Request, res: Response): Promise<void> {
        try {
            const countries = await getCountries();

            res.status(200).json({
                message: "Countries fetched successfully",
                data: countries,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
