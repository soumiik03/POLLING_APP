import { Routes, Route } from 'react-router-dom'
import Landing from './Pages/Landing'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Dashboard from './Pages/Dashboard'
import ProtectedRoute from './Components/ProtectedRoute'
import CreatePoll from './Pages/CreatePoll'
import TakePoll from './Pages/TakePoll'
import Analytics from './Pages/Analytics'
import Results from './Pages/Results'
function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/create" element={<ProtectedRoute><CreatePoll /></ProtectedRoute>} />
      <Route path="/poll/:id" element={<TakePoll />} />
      <Route path="/analytics/:id" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/results/:id" element={<Results />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App