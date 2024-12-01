import prisma from "./prismaClient";
import { faker } from "@faker-js/faker";

async function main() {
    const countries = await prisma.country.findMany();
    const countryIds = countries.map((country) => country.id);

    if (countryIds.length === 0) {
        throw new Error(
            "No countries found in the database. Please seed the countries first."
        );
    }

    // 10 WOMEN hetereosexual
    for (let i = 0; i < 10; i++) {
        await prisma.user.create({
            data: {
                firstName: faker.person.firstName("female"),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                password: "password",
                bio: faker.person.bio(),
                profilePicture: faker.image.avatar(),
                orientation: "heterosexual",
                gender: "female",
                birthDate: faker.date.past({
                    refDate: "2000-01-01T00:00:00.000Z",
                }),
                countryId: faker.helpers.arrayElement(countryIds),
            },
        });
    }

    // 10 WOMEN homosexual
    for (let i = 0; i < 10; i++) {
        await prisma.user.create({
            data: {
                firstName: faker.person.firstName("female"),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                password: "password",
                bio: faker.person.bio(),
                profilePicture: faker.image.avatar(),
                orientation: "homosexual",
                gender: "female",
                birthDate: faker.date.past({
                    refDate: "2000-01-01T00:00:00.000Z",
                }),
                countryId: faker.helpers.arrayElement(countryIds),
            },
        });
    }

    // 10 WOMEN bisexual
    for (let i = 0; i < 10; i++) {
        await prisma.user.create({
            data: {
                firstName: faker.person.firstName("female"),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                password: "password",
                bio: faker.person.bio(),
                profilePicture: faker.image.avatar(),
                orientation: "bisexual",
                gender: "female",
                birthDate: faker.date.past({
                    refDate: "2000-01-01T00:00:00.000Z",
                }),
                countryId: faker.helpers.arrayElement(countryIds),
            },
        });
    }

    // 10 MEN heterosexual
    for (let i = 0; i < 10; i++) {
        await prisma.user.create({
            data: {
                firstName: faker.person.firstName("male"),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                password: "password",
                bio: faker.person.bio(),
                profilePicture: faker.image.avatar(),
                orientation: "heterosexual",
                gender: "male",
                birthDate: faker.date.past({
                    refDate: "2000-01-01T00:00:00.000Z",
                }),
                countryId: faker.helpers.arrayElement(countryIds),
            },
        });
    }

    // 10 MEN HOMOSEXUAL
    for (let i = 0; i < 10; i++) {
        await prisma.user.create({
            data: {
                firstName: faker.person.firstName("male"),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                password: "password",
                bio: faker.person.bio(),
                profilePicture: faker.image.avatar(),
                orientation: "homosexual",
                gender: "male",
                birthDate: faker.date.past({
                    refDate: "2000-01-01T00:00:00.000Z",
                }),
                countryId: faker.helpers.arrayElement(countryIds),
            },
        });
    }

    // 10 MEN BISEXUAL
    for (let i = 0; i < 10; i++) {
        await prisma.user.create({
            data: {
                firstName: faker.person.firstName("male"),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                password: "password",
                bio: faker.person.bio(),
                profilePicture: faker.image.avatar(),
                orientation: "bisexual",
                gender: "male",
                birthDate: faker.date.past({
                    refDate: "2000-01-01T00:00:00.000Z",
                }),
                countryId: faker.helpers.arrayElement(countryIds),
            },
        });
    }

    console.log("Seed completed!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
