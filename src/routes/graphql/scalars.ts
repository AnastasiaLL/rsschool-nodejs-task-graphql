import { GraphQLScalarType, Kind } from 'graphql';




export const MemberTypeId = new GraphQLScalarType({
  name: 'MemberTypeId',
  description:
    'Member type identifier (e.g. BASIC, BUSINESS, PREMIUM). Treated as string.',
  serialize(value: unknown) {
    return String(value);
  },
  parseValue(value: unknown) {
    return String(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return ast.value;
    }
    return null;
  },
});