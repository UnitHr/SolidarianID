import { ApolloError } from '@apollo/client';
import { apolloClient } from '../lib/apolloClient';
import { GET_COMMUNITY_BY_ID } from '../graphql/community.queries';

export interface GraphQLCommunity {
  id: string;
  name: string;
  description: string;
  adminId: string;
  admin: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

/**
 * Fetches a community by ID using GraphQL, including admin information
 */
export async function getCommunityByIdGraphQL(id: string): Promise<GraphQLCommunity> {
  try {
    const { data } = await apolloClient.query({
      query: GET_COMMUNITY_BY_ID,
      variables: { id },
    });

    return data.community;
  } catch (error) {
    console.error('Error fetching community by GraphQL:', error);
    if (error instanceof ApolloError) {
      throw new Error(error.message);
    }
    throw error;
  }
}
