import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ApolloProvider } from './lib/ApolloProvider';
import App from './pages/App';
import store from './store';
import { initializeAuth } from './store/slices/authSlice';
import ServiceWorkerRegistration from './components/ServiceWorkerRegistration';

// Initialize authentication state from stored data - we are using this for the Next.js frontend
store.dispatch(initializeAuth());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ApolloProvider>
          <App />
        </ApolloProvider>
      </BrowserRouter>
    </Provider>
    <ServiceWorkerRegistration />
  </StrictMode>
);
