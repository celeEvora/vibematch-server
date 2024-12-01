import { fetchAndPopulateCountriesTable } from "./fetchAndPopulateCountries";

(async () => {
    console.log("Starting the population process...");
    await fetchAndPopulateCountriesTable();
    console.log("Population process completed.");
    process.exit(0);
})();
