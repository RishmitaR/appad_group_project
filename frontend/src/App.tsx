import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Auth/Login.tsx'
import Signup from './pages/Auth/Signup.tsx'
import ProjectManagementPage from './pages/Project/ProjectGateway.tsx'
import ProjectDetail from './pages/Project/ProjectDetail.tsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/projectmanagement" element={<ProjectManagementPage />} />
        <Route path="/projectdetails" element={<ProjectDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App
