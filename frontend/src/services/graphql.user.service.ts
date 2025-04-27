import { ApolloError } from '@apollo/client';
import { apolloClient } from '../lib/apolloClient';
import { GET_USER_BY_ID } from '../graphql/user.queries';

export interface GraphQLUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  age?: string;
  showAge?: boolean;
  showEmail?: boolean;
  followersCount: number;
  followingCount: number;
}

/**
 * Fetches a user by ID using GraphQL, including followers/following counts
 */
export async function getUserByIdGraphQL(id: string): Promise<GraphQLUser> {
  try {
    const { data } = await apolloClient.query({
      query: GET_USER_BY_ID,
      variables: { id },
    });

    return data.user;
  } catch (error) {
    console.error('Error fetching user by GraphQL:', error);
    if (error instanceof ApolloError) {
      throw new Error(error.message);
    }
    throw error;
  }
}
