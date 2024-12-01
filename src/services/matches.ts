import prisma from "../../prisma/prismaClient";
import { Like, Match, User } from "@prisma/client";

export async function getPossibleMatches(
    userId: number
): Promise<Partial<User>[]> {
    // Obtain the gender and orientation of the user
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { gender: true, orientation: true },
    });

    if (!user) {
        throw new Error(`User with id ${userId} not found`);
    }

    // Obtain the ID of users that are already interacted with the user
    const interactedUserIds = await prisma.like.findMany({
        where: {
            OR: [
                { fromUserId: userId }, // Users that the logged in user liked or noped
                { toUserId: userId }, // Users that liked or noped the logged in user
            ],
        },
        select: {
            fromUserId: true,
            toUserId: true,
        },
    });

    // Remove duplicates from the list of interacted user IDs
    const excludedUserIds = [
        ...new Set(
            interactedUserIds.flatMap((like) => [
                like.fromUserId,
                like.toUserId,
            ])
        ),
    ];

    let potentialMatches: Partial<User>[] = [];

    // Find potential matches based on the logic for each orientation type
    if (user.orientation === "heterosexual") {
        potentialMatches = await prisma.user.findMany({
            where: {
                id: { notIn: [userId, ...excludedUserIds] }, // Exclude the user and interacted users
                gender: user.gender === "male" ? "female" : "male",
                OR: [
                    { orientation: "heterosexual" },
                    { orientation: "bisexual" },
                ],
            },
            take: 15, // Limit the number of potential matches to 15
            select: {
                id: true,
                firstName: true,
                lastName: true,
                bio: true,
                profilePicture: true,
                gender: true,
                orientation: true,
                birthDate: true,
                country: {
                    select: { name: true },
                },
            },
        });
    } else if (user.orientation === "homosexual") {
        potentialMatches = await prisma.user.findMany({
            where: {
                id: { notIn: [userId, ...excludedUserIds] },
                gender: user.gender,
                OR: [
                    { orientation: "homosexual" },
                    { orientation: "bisexual" },
                ],
            },
            take: 15,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                bio: true,
                profilePicture: true,
                gender: true,
                orientation: true,
                birthDate: true,
                country: {
                    select: { name: true },
                },
            },
        });
    } else if (user.orientation === "bisexual") {
        if (user.gender === "male") {
            potentialMatches = await prisma.user.findMany({
                where: {
                    id: { notIn: [userId, ...excludedUserIds] },
                    OR: [
                        {
                            gender: "male",
                            orientation: { in: ["homosexual", "bisexual"] },
                        },
                        {
                            gender: "female",
                            orientation: { in: ["heterosexual", "bisexual"] },
                        },
                    ],
                },
                take: 15,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    bio: true,
                    profilePicture: true,
                    gender: true,
                    orientation: true,
                    birthDate: true,
                    country: {
                        select: { name: true },
                    },
                },
            });
        } else {
            potentialMatches = await prisma.user.findMany({
                where: {
                    id: { notIn: [userId, ...excludedUserIds] },
                    OR: [
                        {
                            gender: "male",
                            orientation: { in: ["heterosexual", "bisexual"] },
                        },
                        {
                            gender: "female",
                            orientation: { in: ["homosexual", "bisexual"] },
                        },
                    ],
                },
                take: 15,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    bio: true,
                    profilePicture: true,
                    gender: true,
                    orientation: true,
                    birthDate: true,
                    country: {
                        select: { name: true },
                    },
                },
            });
        }
    }

    return potentialMatches;
}

export async function likeUser(
    fromUserId: number,
    toUserId: number,
    isLike: boolean
): Promise<Like | Match> {
    if (fromUserId === toUserId) {
        throw new Error("Users cannot like themselves");
    }

    const like = await prisma.like.upsert({
        where: {
            fromUserId_toUserId: {
                fromUserId,
                toUserId,
            },
        },
        update: {
            isLike,
        },
        create: {
            fromUserId,
            toUserId,
            isLike,
        },
    });

    if (isLike) {
        // Verify if the other user liked the current user
        const mutualLike = await prisma.like.findUnique({
            where: {
                fromUserId_toUserId: {
                    fromUserId: toUserId,
                    toUserId: fromUserId,
                },
            },
        });

        // if the other user liked the current user, create a match
        if (mutualLike?.isLike) {
            const match = await prisma.match.create({
                data: {
                    user1Id: fromUserId,
                    user2Id: toUserId,
                },
            });

            return match; // Return the match
        }
    }

    return like;
}

export async function getLikesForUser(userId: number) {
    const likes = await prisma.like.findMany({
        where: {
            toUserId: userId,
            isLike: true,
            // Ensure that the user did not interact back yet
            NOT: {
                OR: [
                    {
                        fromUser: {
                            likesTo: {
                                some: {
                                    fromUserId: userId, // You already liked them
                                },
                            },
                        },
                    },
                    {
                        fromUser: {
                            matches1: {
                                some: { user2Id: userId }, // You already have a match with them
                            },
                        },
                    },
                    {
                        fromUser: {
                            matches2: {
                                some: { user1Id: userId }, // You already have a match with them
                            },
                        },
                    },
                ],
            },
        },
        select: {
            fromUserId: true,
            fromUser: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profilePicture: true,
                },
            },
        },
    });

    return likes.map((like) => like.fromUser);
}

export async function getMatchesForUser(userId: number) {
    const matches = await prisma.match.findMany({
        where: {
            OR: [{ user1Id: userId }, { user2Id: userId }],
        },
        select: {
            id: true,
            user1: {
                select: {
                    id: true,
                    firstName: true,
                    profilePicture: true,
                },
            },
            user2: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profilePicture: true,
                },
            },
        },
    });

    return matches.map((match) => {
        const isUser1 = match.user1.id === userId;
        return isUser1 ? match.user2 : match.user1;
    });
}
