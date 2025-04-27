import { ApolloClient, InMemoryCache, HttpLink, from, split } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getToken } from '../services/user.service';

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

// HTTP link with auth token
const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql',
  headers: {
    get authorization() {
      const token = getToken();
      return token ? `Bearer ${token}` : '';
    },
  },
});

// WebSocket link for subscriptions using subscriptions-transport-ws
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:3000/graphql',
  options: {
    reconnect: true,
    connectionParams: () => {
      const token = getToken();
      return {
        authorization: token ? `Bearer ${token}` : '',
      };
    },
  },
});

// Split links, so we do HTTP for queries and mutations, WS for subscriptions
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

// Create cache with normalization via typePolicies
const cache = new InMemoryCache({
  typePolicies: {
    UserModel: {
      keyFields: ['id'],
    },
    CommunityModel: {
      keyFields: ['id'],
    },
    NotificationModel: {
      keyFields: ['id'],
    },
  },
});

// Apollo Client instance
export const apolloClient = new ApolloClient({
  link: from([errorLink, splitLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});
