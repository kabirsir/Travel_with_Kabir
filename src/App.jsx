import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import PlacesGrid from './components/PlacesGrid.jsx'
import PlaceModal from './components/PlaceModal.jsx'
import Footer from './components/Footer.jsx'
import Gallery from './components/Gallery.jsx'
import BookingConfirmation from './pages/BookingConfirmation.jsx'
import Booking from './pages/Booking.jsx'
import { places as PLACES } from './data/places.js'
import Admin from './pages/Admin.jsx'
import Login from './components/Login.jsx'
import AdminLogin from './pages/AdminLogin.jsx'

function Home() {
  const [selected, setSelected] = useState(null)

  return (
    <>
      <Hero />
      <PlacesGrid places={PLACES} onView={setSelected} />
      <PlaceModal open={!!selected} place={selected} onClose={() => setSelected(null)} />
    </>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking/:id" element={<BookingConfirmation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

