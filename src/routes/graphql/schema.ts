import { GraphQLSchema } from 'graphql';
import { RootQueryType } from './resolvers/queries.js';
import { RootMutationType } from './resolvers/mutations.js';

export const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});