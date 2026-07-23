import './App.css'
import { BrowserRouter, Routes, Link, Route} from 'react-router-dom';
import Login from './pages/Auth/Login.tsx'
import ProjectManagementPage from './pages/Project/ProjectGateway.tsx'
import ProjectDetail from './pages/Project/ProjectDetail.tsx'

function App() {
  return (
    <BrowserRouter>
      {/* Navigation */}
      {/* <nav>
        <Link to="/">Login Page</Link> |{" "}
        <Link to="/projectmanagement">Project Management Page</Link> |{" "}
        <Link to="/projectdetails">Project Detail Page</Link>
      </nav> */}
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/projectmanagement" element={<ProjectManagementPage/>} />
        <Route path="/projectdetails" element={<ProjectDetail/>} /> 
      </Routes>
  </BrowserRouter>
  );
}; 

export default App
