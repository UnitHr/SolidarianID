import { AppRoutes } from '../routes/routes';
import { SolidarianNavbar } from '../components/SolidarianNavbar';
import { Footer } from '../components/Footer';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <SolidarianNavbar />
      <div className="flex-grow-1">
        <AppRoutes />
      </div>
      <Footer />
    </div>
  );
}

export default App;
