import { ApolloError } from '@apollo/client';
import { apolloClient } from '../lib/apolloClient';
import { GET_USER_BY_ID } from '../graphql/user.queries';
import { UserProfile } from '../lib/types/user-profile.types';

export async function getUserByIdGraphQL(id: string): Promise<UserProfile> {
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
