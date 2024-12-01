"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();

prisma.user
    .create({
        data: {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "password123",
            bio: "This is a bio",
            image: "http://example.com/image.jpg",
            sexuality: "STRAIGHT",
            gender: "male",
            birthDate: new Date("1990-01-01"),
            cityId: 51,
        },
    })
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.log(error);
    });

exports.default = prisma;
