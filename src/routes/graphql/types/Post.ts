import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { UserType } from "./User.js";


export const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: { type: UUIDType },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        
        author: { 
            type: UserType,
            resolve: async (parent, _, { prisma }) => {
                return await prisma.user.findUnique({
                    where: { id: parent.authorId }
                });
            }
        },
        
        authorId: { type: UUIDType },
    })
});
