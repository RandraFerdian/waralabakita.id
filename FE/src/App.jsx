// src/App.jsx

import './App.css'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom' // 1. Impor Outlet

// Halaman-halaman
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPassword from './pages/ForgotPassword'
import ProductDetailPage from './pages/ProductDetailPage'
import HomePage from './pages/HomePage'

// Komponen Layout
import Header from './components/Header'
import Footer from './components/Footer'

function MainLayout () {
  return (
    <div>
      <Header />
      <main className='bg-gray-50/70 min-h-screen pt-8 pb-16'>
        {/* <Outlet /> adalah tempat Halaman Anda (Home/Detail) akan dirender */}
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route element={<MainLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/product/:productId' element={<ProductDetailPage />} />
          {/* <Route path='/kategori' element={<KategoriPage />} /> */}
          {/* <Route path='/profile' element={<ProfilePage />} /> */}
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App