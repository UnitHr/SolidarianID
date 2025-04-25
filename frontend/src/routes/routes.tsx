import { Routes, Route } from 'react-router-dom';

// General
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';

// User
import { UserHistory } from '../pages/UserHistory';
import { Notifications } from '../pages/Notifications';

// Community
import { SearchCommunities } from '../pages/SearchCommunities';
import { CreateCommunityRequest } from '../pages/CreateCommunityRequest';
import { CommunityDetails } from '../pages/CommunityDetails';
import { CreateCause } from '../pages/CreateCause';

// Cause
import { SearchCauses } from '../pages/SearchCauses';
import { CauseDetails } from '../pages/CauseDetails';
import { CreateAction } from '../pages/CreateAction';

// Action
import { SearchActions } from '../pages/SearchActions';
import { ActionDetails } from '../pages/ActionDetails';

export function AppRoutes() {
  return (
    <Routes>
      {/* General */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User */}
      <Route path="/profile" element={<UserHistory />} />
      <Route path="/notifications" element={<Notifications />} />

      {/* Community */}
      <Route path="/communities" element={<SearchCommunities />} />
      <Route path="/communities/request" element={<CreateCommunityRequest />} />
      <Route path="/communities/:communityId" element={<CommunityDetails />} />
      <Route path="/communities/:communityId/causes/new" element={<CreateCause />} />

      {/* Cause */}
      <Route path="/causes" element={<SearchCauses />} />
      <Route path="/causes/:causeId" element={<CauseDetails />} />
      <Route path="/causes/:causeId/actions/new" element={<CreateAction />} />

      {/* Action */}
      <Route path="/actions" element={<SearchActions />} />
      <Route path="/actions/:actionId" element={<ActionDetails />} />
    </Routes>
  );
}
