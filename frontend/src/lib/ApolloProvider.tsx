import { ApolloProvider as Provider } from '@apollo/client';
import { ReactNode } from 'react';
import { apolloClient } from './apolloClient';

interface ApolloProviderProps {
  children: ReactNode;
}

export function ApolloProvider({ children }: ApolloProviderProps) {
  return <Provider client={apolloClient}>{children}</Provider>;
}
