import { Home } from "./pages/Home";
import { SearchActions } from "./pages/SearchActions";
import { SearchCauses } from "./pages/SearchCauses";
import { SearchCommunities } from "./pages/SearchCommunities";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/actions" element={<SearchActions />} />
      <Route path="/causes" element={<SearchCauses />} />
      <Route path="/communities" element={<SearchCommunities />} />
    </Routes>
  );
}

export default App;
