import './App.css'
import DashboardCliente from './pages/Dashboardcliente/Dashboardcliente.jsx'
import DashboardTecnico from './pages/dashboardTecnico/Dashboardtecnico.jsx'
import Login from './pages/login/Login.jsx'
import { Routes, Route, Navigate } from 'react-router-dom'

function App() {

  return (
    <Routes>
      {/* Redireccionamiento Inicial */}
      <Route path="/" element={<Navigate to="/login"/>} />

      {/* Rutas para las páginas */}
      <Route path="/login" element={<Login/>} />
      <Route path="/dashboardtecnico" element={<DashboardTecnico/>} />
      <Route path="/dashboardcliente" element={<DashboardCliente/>} />
    </Routes>
  )
}

export default App