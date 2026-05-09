import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import HuntPoster from './pages/HuntPoster.jsx'
import Profile from './pages/Profile.jsx'
import Admin from './pages/Admin.jsx'
import ScanQR from './pages/ScanQR.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<ScanQR />} />
        <Route path="/hunt/poster/:posterId" element={<HuntPoster />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}
