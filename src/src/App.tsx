import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { useAuth } from "./hooks/useAuth";
import Layout from "./components/Layout";
import LoginForm from "./components/LoginForm";
import Timeline from "./pages/Timeline";
import MurmurDetail from "./pages/MurmurDetail";
import UserProfile from "./pages/UserProfile";
import "./App.css";

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
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
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
