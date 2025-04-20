import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { SearchActions } from "./pages/SearchActions";
import { SearchCauses } from "./pages/SearchCauses";
import { SearchCommunities } from "./pages/SearchCommunities";
import { CreateCommunityRequest } from "./pages/CreateCommunityRequest";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/actions" element={<SearchActions />} />
      <Route path="/causes" element={<SearchCauses />} />
      <Route path="/communities" element={<SearchCommunities />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/create-community" element={<CreateCommunityRequest />} />
    </Routes>
  );
}

export default App;
