import { User } from "@prisma/client";
import prisma from "../../prisma/prismaClient";

export async function getUserById(id: number): Promise<Partial<User>> {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            bio: true,
            profilePicture: true,
            orientation: true,
            gender: true,
            birthDate: true,
            countryId: true,
            country: {
                select: { name: true },
            },
        },
    });

    if (!user) {
        throw new Error(`User with id ${id} not found`);
    }

    return user;
}

export async function updateUser(
    id: number,
    data: Partial<User>
): Promise<User> {
    if (data.birthDate) {
        const birthDateObj = new Date(data.birthDate);
        birthDateObj.setUTCHours(0, 0, 0, 0);
        data.birthDate = birthDateObj;
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data,
    });

    return updatedUser;
}

export async function updateProfilePicture(
    id: number,
    profilePicture: string
): Promise<User> {
    const updatedUser = await prisma.user.update({
        where: { id },
        data: { profilePicture },
    });

    return updatedUser;
}
