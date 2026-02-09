import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { ProfileType } from "./Profile.js";


export const MemberTypeType = new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
        id: { type: GraphQLString },
        discount: { type: GraphQLFloat },
        postsLimitPerMonth: { type: GraphQLInt },
    })
});

