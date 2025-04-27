import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './lib/context/AuthContext';
import { ApolloProvider } from './lib/ApolloProvider';
import App from './pages/App';
import ServiceWorkerRegistration from './components/ServiceWorkerRegistration';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ApolloProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ApolloProvider>
    </BrowserRouter>
    <ServiceWorkerRegistration />
  </StrictMode>
);
