import prisma from "../../prisma/prismaClient";

export async function getChats(userId: number) {
    const chats = await prisma.chat.findMany({
        where: {
            OR: [{ user1Id: userId }, { user2Id: userId }],
            messages: {
                some: {},
            },
        },
        select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            user1: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
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
            lastMessage: {
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                },
            },
        },
    });

    // Filter to just return the other user in the chat
    return chats.map((chat) => {
        const otherUser = chat.user1.id === userId ? chat.user2 : chat.user1;

        return {
            chatId: chat.id,
            otherUser,
            lastMessage: chat.lastMessage,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
        };
    });
}

export async function sendMessage(
    senderId: number,
    receiverId: number,
    content: string
) {
    const existingChat = await prisma.chat.findFirst({
        where: {
            OR: [
                { user1Id: senderId, user2Id: receiverId },
                { user1Id: receiverId, user2Id: senderId },
            ],
        },
    });

    let chatId: number;

    if (!existingChat) {
        // If chat doesn't exist, create a new one
        const newChat = await prisma.chat.create({
            data: {
                user1Id: senderId,
                user2Id: receiverId,
            },
        });
        chatId = newChat.id;
    } else {
        // If chat exists, use the existing one
        chatId = existingChat.id;
    }

    // Create the message associated with the chat
    const message = await prisma.message.create({
        data: {
            chatId,
            senderId,
            content,
        },
    });

    // Update the chat to have the last message id
    await prisma.chat.update({
        where: { id: chatId },
        data: {
            lastMessageId: message.id,
        },
    });

    return message;
}

export async function getMessages(chatId: number) {
    const messages = await prisma.message.findMany({
        where: {
            chatId,
        },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            senderId: true,
            content: true,
            createdAt: true,
            sender: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profilePicture: true,
                },
            },
        },
    });

    return messages;
}
