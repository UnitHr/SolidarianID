import { useQuery } from '@apollo/client';
import { GET_COMMUNITY_BY_ID } from '../../graphql/community.queries';
import { CommunityDetails } from '../types/community.types';

/**
 * Hook to fetch community details by ID using GraphQL
 */
export const useCommunityById = (id: string) => {
  const { loading, error, data, refetch } = useQuery(GET_COMMUNITY_BY_ID, {
    variables: { id },
    skip: !id, // Skip the query if id is falsy
    fetchPolicy: 'cache-and-network',
  });

  return {
    loading,
    error,
    community: data?.community as CommunityDetails | undefined,
    refetch,
  };
};
