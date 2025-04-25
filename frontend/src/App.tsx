import { AppRoutes } from './routes/routes';
import { Footer } from './components/Footer';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ flex: 1 }}>
        <AppRoutes />
      </div>
      <Footer />
    </div>
  );
}

export default App;
