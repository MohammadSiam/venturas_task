import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Layout from "./components/Layout";
import Timeline from "./pages/Timeline";
import MurmurDetail from "./pages/MurmurDetail";
import UserProfile from "./pages/UserProfile";
import "./App.css";

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Timeline />} />
            <Route path="/murmur/:id" element={<MurmurDetail />} />
            <Route path="/user/:id" element={<UserProfile />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
