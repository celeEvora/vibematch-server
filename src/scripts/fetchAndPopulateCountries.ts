import axios from "axios";
import prisma from "../../prisma/prismaClient";

async function fetchCountries(): Promise<
    { name: string; iso2Code: string; flag: string }[]
> {
    const response = await axios.get(
        "https://restcountries.com/v3.1/all?fields=name,cca2,flags"
    );
    if (!response.data || response.data.length === 0) {
        throw new Error("No countries data found in API response");
    }

    return response.data.map((country: any) => ({
        name: country.name.common,
        iso2Code: country.cca2,
        flag: country.flags.png,
    }));
}

async function populateCountriesTable(
    countries: { name: string; iso2Code: string; flag: string }[]
): Promise<void> {
    if (!countries || countries.length === 0) {
        throw new Error("No countries to insert");
    }

    const result = await prisma.country.createMany({
        data: countries.map((country) => ({
            ...country,
            createdAt: new Date(),
            updatedAt: new Date(),
        })),
        skipDuplicates: true,
    });

    console.log(
        `Successfully inserted ${result.count} countries into the database.`
    );
}

export async function fetchAndPopulateCountriesTable(): Promise<void> {
    try {
        console.log("Fetching countries...");
        let countries = await fetchCountries();

        countries = countries.sort((a, b) => a.name.localeCompare(b.name));

        console.log("Populating countries table...");
        await populateCountriesTable(countries);

        console.log("Finished populating countries table.");
    } catch (error) {
        console.error("Error fetching and populating countries table:", error);
    } finally {
        await prisma.$disconnect();
    }
}
