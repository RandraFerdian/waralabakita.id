import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import InputField from '../components/InputField'

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
)

// Ikon Mata (terlihat)

const EyeIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='h-5 w-5'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={2}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
    />

    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
    />
  </svg>
)

// Ikon Mata (tercoret/tersembunyi)

const EyeOffIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='h-5 w-5'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={2}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18'
    />
  </svg>
)

// --- Komponen Halaman Login ---
export default function LoginPage () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const errorTimeoutRef = useRef({ email: null, password: null })

  useEffect(() => {
    return () => {
      clearTimeout(errorTimeoutRef.current.email)
      clearTimeout(errorTimeoutRef.current.password)
    }
  }, [])

  const handleLogin = e => {
    e.preventDefault()


    clearTimeout(errorTimeoutRef.current.email)

    clearTimeout(errorTimeoutRef.current.password)


    setEmailError('')

    setPasswordError('')

    // --- Logika Validasi Sederhana ---

    const CORRECT_EMAIL = 'user@example.com'

    const CORRECT_PASSWORD = 'password123'

    let isValid = true

    if (email !== CORRECT_EMAIL) {
      setEmailError('* Email salah atau tidak terdaftar')

      isValid = false

      errorTimeoutRef.current.email = setTimeout(() => {
        setEmailError('')
      }, 2000)
    }

    if (password !== CORRECT_PASSWORD) {
      setPasswordError('* Password salah')

      isValid = false

      errorTimeoutRef.current.password = setTimeout(() => {
        setPasswordError('')
      }, 2000)
    }

    if (isValid) {
      localStorage.setItem('hasLoggedIn', 'true')

      alert('Login Berhasil!')

      // Arahkan ke dashboard atau halaman utama setelah login
      // Contoh: window.location.href = '/dashboard';
    }
  }

  // --- Bagian return JSX yang sudah di-refactor ---
  return (
    <div className='min-h-screen flex items-center justify-center bg-teal-50 px-4 py-8 sm:py-12'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-xl shadow-teal-200/50 border border-teal-200 p-6 sm:p-8 relative'>
        <button
          onClick={() => navigate(-1)}
          className='absolute top-4 left-4 sm:top-6 sm:left-6 text-gray-500 hover:text-gray-800 transition-colors'
          aria-label='Kembali'
        >
          <BackArrowIcon />
        </button>

        <h2 className='text-2xl sm:text-3xl font-bold text-center text-gray-900 mt-8 sm:mt-10'>
          Selamat Datang Kembali !
        </h2>
        <p className='text-center text-gray-500 mb-8 mt-2 text-sm'>
          Masuk untuk melanjutkan perjalanan bisnis Anda di
          <br />
          <span className='font-medium text-teal-600'>WaralabaKita.id</span>
        </p>

        <form onSubmit={handleLogin} className='space-y-4'>
          <InputField
            id='email'
            label='Alamat Email'
            type='email'
            placeholder='masukkan alamat email'
            value={email}
            onChange={e => {
              setEmail(e.target.value)
              if (emailError) setEmailError('')
            }}
            error={emailError} // Kirim state error sebagai prop
            required
          />

          <InputField
            id='password'
            label='Password'
            type={showPassword ? 'text' : 'password'}
            placeholder='**********'
            value={password}
            onChange={e => {
              setPassword(e.target.value)
              if (passwordError) setPasswordError('')
            }}
            error={passwordError} // Kirim state error sebagai prop
            required
            // Kirim Tombol Ikon Mata sebagai prop 'suffix'
            suffix={
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='text-gray-500 hover:text-gray-700'
                aria-label={
                  showPassword ? 'Sembunyikan password' : 'Tampilkan password'
                }
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            }
          />

          {/* Link Lupa Password */}
          <div className='text-right'>
            <Link
              to='/forgot-password'
              className='text-sm font-medium text-teal-600 hover:underline'
            >
              Lupa Password?
            </Link>
          </div>

          {/* Tombol Login */}
          <button
            type='submit'
            className='w-full bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/30'
            style={{ backgroundColor: 'rgb(56, 178, 172)' }}
          >
            Masuk ke Akun
          </button>
        </form>

        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-600'>
            Belum punya akun?{' '}
            <Link
              to='/register'
              className='text-teal-600 font-medium hover:underline'
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
