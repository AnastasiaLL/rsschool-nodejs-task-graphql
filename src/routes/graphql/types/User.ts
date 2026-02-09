import { strict } from "assert"
import { GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql"
import { UUIDType } from "./uuid.js"
import { ProfileType } from "./Profile.js"
import { PostType } from "./Post.js"



export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: ()=> ({
        id: { type: UUIDType },
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },

        profile: {
            type: ProfileType,
            resolve: async (parent, _, { prisma }) => {
                if (parent.profile) {
                    return parent.profile;
                }
                return await prisma.profile.findUnique({
                    where: { userId: parent.id }
                });
            }
        },
        
        posts: { 
            type: new GraphQLList(PostType),
            resolve: async (parent, _, { prisma }) => {
                if (parent.posts) {
                    return parent.posts;
                }
                return await prisma.post.findMany({
                    where: { authorId: parent.id }
                });
            }
        },

        userSubscribedTo: { 
            type: new GraphQLList(UserType),
            resolve: async (parent, _, { prisma }) => {
                const subscriptions = await prisma.subscribersOnAuthors.findMany({
                    where: { subscriberId: parent.id },
                    include: { author: true },
                });
                return subscriptions.map(sub => sub.author);
            }
        },
        
        subscribedToUser: { 
            type: new GraphQLList(UserType),
            resolve: async (parent, _, { prisma }) => {
                const subscribers = await prisma.subscribersOnAuthors.findMany({
                    where: { authorId: parent.id },
                    include: { subscriber: true },
                });
                return subscribers.map(sub => sub.subscriber);
            }
        },
    })
})

export const SubscribersOnAuthorsType = new GraphQLObjectType({
    name: 'SubscribersOnAuthors',
    fields: ()=> ({
        subscriber: { type: UserType },
        subscriberId: { type: GraphQLString },

        author: { type: UserType },
        authorId: {type: GraphQLString},

    })
})
