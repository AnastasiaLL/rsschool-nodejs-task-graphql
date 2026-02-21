import { PrismaClient } from '@prisma/client';
import { createUserLoader, createSubscribedToLoader, createSubscribedToUserLoader, createPostsLoader, createProfileLoader } from './loaders/loaders.js';


export type GraphQLContext = {
  prisma: PrismaClient;
  loaders: {
    user: ReturnType<typeof createUserLoader>;
    subscribedTo: ReturnType<typeof createSubscribedToLoader>;
    subscribedToUser: ReturnType<typeof createSubscribedToUserLoader>;
    posts: ReturnType<typeof createPostsLoader>;
    profile: ReturnType<typeof createProfileLoader>;
  };
};

export const createGraphQLContext = (prisma: PrismaClient): GraphQLContext => ({
  prisma,
  loaders: {
    user: createUserLoader(prisma),
    subscribedTo: createSubscribedToLoader(prisma),
    subscribedToUser: createSubscribedToUserLoader(prisma),
    posts: createPostsLoader(prisma),
    profile: createProfileLoader(prisma),
  },
});