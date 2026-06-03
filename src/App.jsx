import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Booking from './pages/Booking'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"      element={<Landing />} />
        <Route path="/book"  element={<Booking />} />
        <Route path="/owner" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}
