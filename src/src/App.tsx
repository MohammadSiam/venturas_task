import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocalAuth } from "./hooks/useLocalAuth";
import Layout from "./components/Layout";
import AuthWrapper from "./components/AuthWrapper";
import Timeline from "./pages/Timeline";
import MurmurDetail from "./pages/MurmurDetail";
import UserProfile from "./pages/UserProfile";
import "./App.css";

const App: React.FC = () => {
  const { user, isLoading } = useLocalAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthWrapper />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Timeline />} />
          <Route path="/murmur/:id" element={<MurmurDetail />} />
          <Route path="/user/:id" element={<UserProfile />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
