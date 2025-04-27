import { ApolloError } from '@apollo/client';
import { apolloClient } from '../lib/apolloClient';
import { GET_USER_BY_ID, CREATE_USER } from '../graphql/user.queries';
import { UserProfile } from '../lib/types/user-profile.types';
import { RegisterPayload } from '../lib/types/user.types';

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
      const graphQLError = error.graphQLErrors?.[0]?.message;
      throw new Error(graphQLError || error.message);
    }
    throw error;
  }
}

export async function registerUserGraphQL(payload: RegisterPayload): Promise<string> {
  try {
    const createUserInput = {
      ...payload,
      birthDate: new Date(payload.birthDate).toISOString(),
    };

    const result = await apolloClient.mutate({
      mutation: CREATE_USER,
      variables: { createUserInput },
      errorPolicy: 'all',
    });

    // Check if we have GraphQL errors
    if (result.errors && result.errors.length > 0) {
      throw new ApolloError({
        graphQLErrors: result.errors,
      });
    }
    return result.data.createUser.id;
  } catch (error) {
    if (error instanceof ApolloError) {
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        throw new Error(error.graphQLErrors[0].message);
      }

      if (error.networkError) {
        throw new Error(`Network error: ${error.networkError.message}`);
      }
    }
    throw error;
  }
}
