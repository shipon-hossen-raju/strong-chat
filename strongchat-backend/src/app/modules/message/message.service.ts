import prisma from "../../../shared/prisma";

const createIntoDb = async (data: any, senderId: string) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    // const result = await prisma.message.create({ data });
    // return result;

    const { receiverId, content, type = "TEXT", mediaUrl } = data;

    const message = await prisma.message.create({
      data: {
        content,
        type,
        mediaUrl,
        senderId: senderId,
        receiverId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return message;
  });

  return transaction;
};

const getsMessagesBySenderId = async (receiverId: string, senderId: string) => {
  const result = await prisma.message.findMany({
    where: {
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return result;
};

export const messageService = {
  createIntoDb,
  getsMessagesBySenderId,
};
