import { useQuery, useMutation, ApolloError } from '@apollo/client';
import { GET_USER_BY_ID, CREATE_USER } from '../../graphql/user.queries';
import { USER_EXTENDED_FRAGMENT } from '../../graphql/fragments';
import { UserProfile } from '../types/user-profile.types';
import { RegisterPayload } from '../types/user.types';

/**
 * Hook to fetch a user by ID using GraphQL
 */
export const useUserById = (id: string) => {
  const { loading, error, data, refetch } = useQuery(GET_USER_BY_ID, {
    variables: { id },
    skip: !id, // Skip the query if id is falsy
    fetchPolicy: 'cache-and-network', // Default fetch policy
  });

  return {
    loading,
    error,
    user: data?.user as UserProfile | undefined,
    refetch,
  };
};

/**
 * Hook for user registration mutation using GraphQL
 */
export const useRegisterUser = () => {
  const [mutate, { loading, error, data }] = useMutation(CREATE_USER, {
    update: (cache, { data }) => {
      if (data?.createUser) {
        // Write to fragment cache
        cache.writeFragment({
          id: cache.identify(data.createUser),
          fragment: USER_EXTENDED_FRAGMENT,
          data: data.createUser,
        });

        // Update query cache
        cache.writeQuery({
          query: GET_USER_BY_ID,
          variables: { id: data.createUser.id },
          data: {
            user: data.createUser,
          },
        });
      }
    },
  });

  // Function to register a user
  const registerUser = async (payload: RegisterPayload): Promise<string> => {
    try {
      const createUserInput = {
        ...payload,
        birthDate: new Date(payload.birthDate).toISOString(),
      };

      const result = await mutate({
        variables: { createUserInput },
        errorPolicy: 'all',
      });

      if (result.errors && result.errors.length > 0) {
        throw new ApolloError({
          graphQLErrors: result.errors,
        });
      }

      return result.data.createUser.id;
    } catch (error) {
      console.error('Error registering user:', error);

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
  };

  return {
    registerUser,
    loading,
    error,
    createdUser: data?.createUser,
  };
};
