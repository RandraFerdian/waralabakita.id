import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';

// --- Helper Components untuk Ikon (SVG) ---

// Ikon Panah Kembali
const BackArrowIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='h-6 w-6'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={2}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M10 19l-7-7m0 0l7-7m-7 7h18'
    />
  </svg>
);

// Ikon Email Terkirim
const EmailSentIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-16 w-16 mx-auto text-teal-500" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M12 12l6.75 4.5M12 12l-6.75 4.5" />
    </svg>
);


// --- Komponen Halaman Lupa Password ---

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate(); // Hook untuk navigasi

  const handleSubmit = e => {
    e.preventDefault();
    // Simulasi pengiriman permintaan reset password
    // Dalam aplikasi nyata, di sini Anda akan memanggil API
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-teal-50 px-4 py-8'>
      {/* Kartu Form */}
      <div className='w-full max-w-md bg-white rounded-2xl shadow-xl shadow-teal-200/50 border border-teal-200 p-8 relative'>
        
        {/* Tombol Panah Kembali (Konsisten dengan Login) */}
        { !submitted && (
            <button
              onClick={() => navigate(-1)} // Aksi 'kembali'
              className='absolute top-6 left-6 text-gray-500 hover:text-gray-800 transition-colors'
              aria-label='Kembali'
            >
              <BackArrowIcon />
            </button>
        )}


        {/* Konten akan berubah berdasarkan status 'submitted' */}
        {!submitted ? (
          <>
            {/* Judul */}
            <h2 className='text-3xl font-bold text-center text-gray-900 mt-10'>
              Lupa Password?
            </h2>

            {/* Subjudul */}
            <p className='text-center text-gray-500 mb-8 mt-2 text-sm'>
              Jangan khawatir! Masukkan email Anda di bawah ini
              <br />
              dan kami akan mengirimkan tautan untuk reset.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className='space-y-5'>
              {/* Input Email */}
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Alamat Email
                </label>
                <input
                  id='email'
                  type='email'
                  placeholder='masukkan alamat email terdaftar'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className='w-full px-4 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 border-gray-300 focus:ring-teal-500 focus:border-teal-500'
                />
              </div>

              {/* Tombol Kirim */}
              <button
                type='submit'
                className='w-full bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/30'
                style={{ backgroundColor: 'rgb(56, 178, 172)' }} // Warna solid persis
              >
                Kirim Tautan Reset
              </button>
            </form>
          </>
        ) : (
          <div className='text-center py-8'>
            <EmailSentIcon />
            <h2 className='text-2xl font-bold text-gray-900 mt-4'>
              Tautan Terkirim!
            </h2>
            <p className='text-gray-600 mt-2'>
              Silakan periksa kotak masuk email Anda di{' '}
              <span className='font-semibold text-teal-600'>{email}</span> untuk
              melanjutkan.
            </p>
            <Link to="/login" className="mt-6 inline-block text-sm text-teal-600 hover:underline font-medium">
                ← Kembali ke Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;

