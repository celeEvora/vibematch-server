import { Country } from "@prisma/client";
import prisma from "../../prisma/prismaClient";

export async function getCountries(): Promise<Country[]> {
    const countries = await prisma.country.findMany();
    if (!countries) {
        throw new Error("No countries found");
    }

    return countries;
}
