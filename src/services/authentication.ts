import { User, gender, orientation } from "@prisma/client";
import prisma from "../../prisma/prismaClient";
import bcrypt from "bcrypt";
import JWTManager from "../helpers/jwt.manager";

type RegisterRequest = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    bio: string;
    profilePicture: string;
    orientation: orientation;
    gender: gender;
    birthDate: Date;
    countryId: number;
};

type AuthResponse = {
    user: any;
    token: string;
    expiresIn: number | string;
};

async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

async function userExists(email: string): Promise<boolean> {
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });
    return existingUser !== null;
}

function transformUser(user: any): any {
    return {
        ...user,
        city: user.city?.name,
        country: user.city?.country?.name,
    };
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
    const {
        email,
        password,
        profilePicture,
        birthDate,
        countryId,
        ...userData
    } = data;

    const exists = await userExists(email);
    if (exists) {
        throw new Error("User with this email already exists");
    }

    const hashedPassword = await hashPassword(password);

    const birthDateObj = new Date(birthDate);
    birthDateObj.setUTCHours(0, 0, 0, 0);

    if (isNaN(birthDateObj.getTime())) {
        throw new Error(
            "Invalid birthDate format. Expected a valid ISO-8601 date."
        );
    }

    const now = new Date();

    const user = await prisma.user.create({
        data: {
            ...userData,
            email,
            password: hashedPassword,
            profilePicture,
            birthDate: birthDateObj,
            countryId: parseInt(countryId as unknown as string),
            createdAt: now,
            updatedAt: now,
        },
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
            createdAt: true,
            updatedAt: true,
            country: {
                select: {
                    name: true,
                    iso2Code: true,
                },
            },
        },
    });

    if (!user) {
        throw new Error("Failed to create user");
    }

    const transformedUser = transformUser(user);

    const token = JWTManager().generate({
        id: user.id,
        email: user.email,
    });

    return {
        user: transformedUser,
        token: token.accessToken,
        expiresIn: token.expiresIn,
    };
}

export async function login(data: {
    email: string;
    password: string;
}): Promise<AuthResponse> {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("User with this email does not exist");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        throw new Error("Invalid password");
    }

    const token = JWTManager().generate({
        id: user.id,
        email: user.email,
    });

    return {
        user,
        token: token.accessToken,
        expiresIn: token.expiresIn,
    };
}

export function logout() {
    // TODO: implement logout logic
}

export async function me(userId: number): Promise<Omit<User, "password">> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            bio: true,
            profilePicture: true,
            orientation: true,
            gender: true,
            birthDate: true,
            createdAt: true,
            updatedAt: true,
            countryId: true,
            country: {
                select: {
                    name: true,
                    iso2Code: true,
                },
            },
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}
