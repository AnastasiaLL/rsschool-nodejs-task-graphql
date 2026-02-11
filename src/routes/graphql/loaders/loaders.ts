import { MemberType, PrismaClient, Profile, User } from "@prisma/client";
import DataLoader from "dataloader";
import { prismaStatsSchema } from "../../stats/schemas.js";

export const createUserLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, User | null>(async (userIds) => {
    const users = await prisma.user.findMany({
      where: { id: { in: userIds as string[] } },
    });
    
    const userMap = new Map(users.map(user => [user.id, user]));
    return userIds.map(id => userMap.get(id) || null);
  });
};

export const createSubscribedToLoader  = (prisma: PrismaClient) => {
  return new DataLoader<string, User[] | null>(async (userIds) => {
    const subscriptions  = await prisma.subscribersOnAuthors.findMany({
      where: { subscriberId: { in: userIds as string[] } },
       include: { author: true },
    });
       const groupedBySubscriber = userIds.map(id => 
      subscriptions
        .filter(sub => sub.subscriberId === id)
        .map(sub => sub.author)
    );
    
    return groupedBySubscriber;
  });
};

export const createSubscribedToUserLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, User[]>(async (userIds) => {
    const subscribers = await prisma.subscribersOnAuthors.findMany({
      where: { authorId: { in: userIds as string[] } },
      include: { subscriber: true },
    });
    
    const groupedByAuthor = userIds.map(id => 
      subscribers
        .filter(sub => sub.authorId === id)
        .map(sub => sub.subscriber)
    );
    
    return groupedByAuthor;
  });
};

export const createPostsLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, unknown[]>(async (authorIds) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: authorIds as string[] } },
    });
    
    const groupedByAuthor = authorIds.map(id => 
      posts.filter(post => post.authorId === id)
    );
    
    return groupedByAuthor;
  });
};

type ProfileWithMemberType = Profile & {
  memberType: MemberType;
};

export const createProfileLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, ProfileWithMemberType | null>(async (userIds) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: userIds as string[] } },
      include: { memberType: true },
    });
    
    const profileMap = new Map(profiles.map(p => [p.userId, p]));
    return userIds.map(id => profileMap.get(id) || null);
  });
};
