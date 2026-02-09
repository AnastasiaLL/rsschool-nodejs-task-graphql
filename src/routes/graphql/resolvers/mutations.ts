import { GraphQLBoolean, GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "../types/uuid.js";
import { PostType } from "../types/Post.js";
import { ProfileType } from "../types/Profile.js";
import { UserType } from "../types/User.js";

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
});

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },  
  }),
});

const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },  
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: GraphQLString },
  }),
});

const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});


export const RootMutationType = new GraphQLObjectType({
  name: 'Mutations',
  fields: () => ({

    //CREATE
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      async resolve(_, { dto }, { prisma }) {
        return await prisma.user.create({
          data: dto,
        });
      },
    },
     
   createProfile: {
    type: new GraphQLNonNull(ProfileType),
    args: {
        dto: {type: new GraphQLNonNull(CreateProfileInput)}
    },
    async resolve(_, {dto}, {prisma}) {
        return await prisma.profile.create({
            data: dto,
            include: { 
                memberType: true,
            }
        });
    }
},

    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      async resolve(_, { dto }, { prisma }) {
        return await prisma.post.create({
          data: dto,
        });
      },
    },

    // UPDATE
    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      async resolve(_, { id, dto }, { prisma }) {
        return await prisma.user.update({
          where: { id },
          data: dto,
        });
      },
    },

changeProfile: {
    type: new GraphQLNonNull(ProfileType),
    args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
    },
    async resolve(_, { id, dto }, { prisma }) {
        return await prisma.profile.update({
            where: { id },
            data: dto,
            include: {  
                memberType: true,
            }
        });
    },
},
    
    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      async resolve(_, { id, dto }, { prisma }) {
        return await prisma.post.update({
          where: { id },
          data: dto,
        });
      },
    },

     // DELETE
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_, { id }, { prisma }) {
        await prisma.user.delete({
          where: { id },
        });
        return id;
      },
    },

    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_, { id }, { prisma }) {
        await prisma.post.delete({
          where: { id },
        });
        return id;
      },
    },

    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_, { id }, { prisma }) {
        await prisma.profile.delete({
          where: { id },
        });
        return id;
      },
    },

     // SUBSCRIPTIONS
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_, { userId, authorId }, { prisma }) {
        await prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: userId,
            authorId: authorId,
          },
        });
        return `${userId} subscribed to ${authorId}`;
      },
    },

    unsubscribeFrom: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
            userId: { type: new GraphQLNonNull(UUIDType) },
            authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        async resolve(_, { userId, authorId }, { prisma }) {
        await prisma.subscribersOnAuthors.delete({
           where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId: authorId,
            },
          },
        });
          return `${userId} unsubscribed from ${authorId}`;
      },

    }

})
})

