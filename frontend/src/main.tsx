import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/styles.css'
import App from './App.tsx'
import ProjectManagementPage from './pages/Project/ProjectGateway.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    /* <App /> */
    {/* <ProjectManagementPage/>  */}
  </StrictMode>,
)
