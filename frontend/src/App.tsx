import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { SearchActions } from './pages/SearchActions';
import { SearchCauses } from './pages/SearchCauses';
import { SearchCommunities } from './pages/SearchCommunities';
import { UserHistory } from './pages/UserHistory';
import { Notifications } from './pages/Notifications';
import { CreateCommunityRequest } from './pages/CreateCommunityRequest';
import { Route, Routes } from 'react-router-dom';
import { Footer } from './components/Footer';
import { CommunityDetails } from './pages/CommunityDetails';
import { CauseDetails } from './pages/CauseDetails';
import { ActionDetails } from './pages/ActionDetails';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/actions" element={<SearchActions />} />
          <Route path="/causes" element={<SearchCauses />} />
          <Route path="/communities" element={<SearchCommunities />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<UserHistory />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/create-community" element={<CreateCommunityRequest />} />
          <Route path="/communities/:communityId" element={<CommunityDetails />} />
          <Route path="/actions/:actionId" element={<ActionDetails />} />
          <Route path="/causes/:causeId" element={<CauseDetails />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
