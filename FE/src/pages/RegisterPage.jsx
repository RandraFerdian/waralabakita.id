import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import InputField from '../components/InputField.jsx'

// --- Ikon-ikon (Tidak ada perubahan) ---
const BackArrowIcon = ({ className = 'h-6 w-6' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={className}
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
// --- End of Icons ---

export default function RegisterPage () {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pencari') // 'pencari' or 'pemilik'

  // State (Tidak ada perubahan)
  const [namaLengkap, setNamaLengkap] = useState('')
  const [email, setEmail] = useState('')
  const [nomorTelepon, setNomorTelepon] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [namaError, setNamaError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [nomorTeleponError, setNomorTeleponError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [agreedError, setAgreedError] = useState('')
  const formProps = {
    namaLengkap,
    setNamaLengkap,
    email,
    setEmail,
    nomorTelepon,
    setNomorTelepon,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    agreed,
    setAgreed,
    namaError,
    setNamaError,
    emailError,
    setEmailError,
    nomorTeleponError,
    setNomorTeleponError,
    passwordError,
    setPasswordError,
    agreedError,
    setAgreedError,
    navigate,
    activeTab,
    setActiveTab
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-teal-50 px-4 py-8 sm:py-12'>
      {/* --- Container Utama ---
      */}
      <div className='w-full max-w-4xl bg-white rounded-2xl shadow-xl shadow-teal-200/50 border border-teal-200 grid overflow-hidden relative'> {/* --- UBAH --- */}
        {/* --- Layout 1: PENCARI (Form Kiri, Panel Kanan) ---
        */}
        <div
          className={`flex w-full transition-opacity duration-500 ease-in-out col-start-1 row-start-1 ${
            activeTab === 'pencari'
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Kolom Kiri: Form */}
          <div className='w-full lg:w-1/2'>
            <FormPencari {...formProps} />
          </div>
          {/* Kolom Kanan: Panel (hilang di mobile) */}
          <div className='hidden lg:flex lg:w-1/2'>
            <PanelPencari />
          </div>
        </div>

        {/* --- Layout 2: PEMILIK (Panel Kiri, Form Kanan) ---
        */}
        <div
          className={`flex w-full transition-opacity duration-500 ease-in-out col-start-1 row-start-1 ${
            activeTab === 'pemilik'
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Kolom Kiri: Panel (hilang di mobile) */}
          <div className='hidden lg:flex lg:w-1/2'>
            <PanelPemilik navigate={navigate} />
          </div>
          {/* Kolom Kanan: Form */}
          <div className='w-full lg:w-1/2'>
            <FormPemilik {...formProps} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ===================================================================
// --- 1. Komponen FormPencari ---
// ===================================================================
function FormPencari (props) {
  const {
    namaLengkap,
    setNamaLengkap,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    agreed,
    setAgreed,
    namaError,
    setNamaError,
    emailError,
    setEmailError,
    passwordError,
    setPasswordError,
    agreedError,
    setAgreedError,
    navigate,
    activeTab,
    setActiveTab
  } = props

  const handleRegister = e => {
    e.preventDefault()
    // ... Logika validasi (sudah benar) ...
    let isValid = true
    if (!namaLengkap) {
      setNamaError('* Nama lengkap wajib diisi')
      isValid = false
    }
    if (!email) {
      setEmailError('* Email wajib diisi')
      isValid = false
    }
    if (password.length < 8) {
      setPasswordError('* Password minimal 8 karakter')
      isValid = false
    }
    if (!agreed) {
      setAgreedError('* Anda harus menyetujui Syarat & Ketentuan')
      isValid = false
    }
    setTimeout(() => {
      setNamaError('')
      setEmailError('')
      setPasswordError('')
      setAgreedError('')
    }, 2000)
    if (isValid) {
      alert(
        `Registrasi Pencari Berhasil:\nNama: ${namaLengkap}\nEmail: ${email}`
      )
      navigate('/login')
    }
  }

  return (
    <div className='p-6 sm:p-8 relative'>
      <button
        onClick={() => navigate(-1)}
        className='absolute top-4 left-4 sm:top-6 sm:left-6 text-gray-500 hover:text-gray-800'
        aria-label='Kembali'
      >
        <BackArrowIcon />
      </button>

      <h2 className='text-3xl font-bold text-center text-gray-900 mt-10'>
        WaralabaKita.id
      </h2>
      <p className='text-center text-gray-500 mb-6 mt-1 text-sm'>
        Mulai bisnis Anda bersama kami
      </p>

      <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

      <form onSubmit={handleRegister} className='space-y-4'>
        {/* ... (Input fields & checkbox) ... */}
        <InputField
          id='nama_pencari'
          label='Nama Lengkap'
          type='text'
          placeholder='masukkan nama lengkap'
          value={namaLengkap}
          onChange={e => setNamaLengkap(e.target.value)}
          error={namaError}
        />
        <InputField
          id='email_pencari'
          label='Alamat Email'
          type='email'
          placeholder='masukkan alamat email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={emailError}
        />
        <InputField
          id='password_pencari'
          label='Password'
          type={showPassword ? 'text' : 'password'}
          placeholder='**********'
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={passwordError}
          suffix={
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='text-gray-500 hover:text-gray-700'
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          }
        />
        <div>
          <div className='flex items-start'>
            <input
              id='agreed'
              type='checkbox'
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className='h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 mt-0.5'
            />
            <label
              htmlFor='agreed'
              className='ml-2 block text-sm text-gray-700'
            >
              Persetujuan{' '}
              <Link
                to='/syarat-ketentuan'
                target='_blank'
                className='font-medium text-teal-600 hover:underline'
              >
                Syarat & Ketentuan
              </Link>
            </label>
          </div>
          {agreedError && (
            <p className='text-red-500 text-xs mt-1'>{agreedError}</p>
          )}
        </div>

        <button
          type='submit'
          className='w-full bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 shadow-lg shadow-teal-500/30'
        >
          Daftar sebagai User
        </button>
      </form>

      <div className='mt-6 text-center'>
        <p className='text-sm text-gray-600'>
          Sudah punya akun?{' '}
          <Link
            to='/login'
            className='text-teal-600 font-medium hover:underline'
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  )
}

// ===================================================================
// --- 2. Komponen PanelPencari ---
// ===================================================================
function PanelPencari () {
  return (
    <div
      className='w-full h-full p-12 text-white flex items-center justify-center relative'
      style={{
        backgroundImage: "url('/images/abstract-bg.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#008374' // Fallback jika SVG gagal dimuat
      }}
    >
      <div className='max-w-sm relative z-10'>
        <h2 className='text-4xl font-bold mb-4 leading-tight'>
          Bergabung dengan Ekosistem Waralaba Terpercaya
        </h2>
        <p className='text-lg text-teal-100'>
          Temukan, bandingkan, dan jalin kerja sama dengan pemilik waralaba
          terpercaya
        </p>
      </div>

    </div>
  )
}

// ===================================================================
// --- 3. Komponen PanelPemilik ---
// ===================================================================
function PanelPemilik ({ navigate }) {
  return (
    <div
      className='w-full h-full p-6 sm:p-12 text-white relative flex items-start justify-center'
      style={{
        backgroundImage: "url('/images/abstract-bg.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#008374' // Fallback jika SVG gagal dimuat
      }}
    >
      <button
        onClick={() => navigate(-1)}
        className='absolute top-4 left-4 sm:top-6 sm:left-6 text-white hover:text-teal-200 z-20'
        aria-label='Kembali'
      >
        <BackArrowIcon />
      </button>

      <div className='mt-24 max-w-sm relative z-10'>
        <h2 className='text-4xl font-bold mb-4 leading-tight'>
          Ekspansi Bisnis Lebih Mudah dan Cepat
        </h2>
        <p className='text-lg text-teal-100'>
          Promosikan waralaba Anda dan temukan mitra terpercaya di seluruh
          Indonesia
        </p>
      </div>
    
    </div>
  )
}

// ===================================================================
// --- 4. Komponen FormPemilik ---
// ===================================================================
function FormPemilik (props) {
  const {
    namaLengkap,
    setNamaLengkap,
    email,
    setEmail,
    nomorTelepon,
    setNomorTelepon,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    namaError,
    setNamaError,
    emailError,
    setEmailError,
    nomorTeleponError,
    setNomorTeleponError,
    passwordError,
    setPasswordError,
    navigate,
    activeTab,
    setActiveTab
  } = props

  const handleNextStep = e => {
    e.preventDefault()
    // ... (Logika validasi Anda) ...
    let isValid = true
    if (!namaLengkap) {
      setNamaError('* Nama lengkap wajib diisi')
      isValid = false
    }
    if (!email) {
      setEmailError('* Email bisnis wajib diisi')
      isValid = false
    }
    if (!nomorTelepon) {
      setNomorTeleponError('* Nomor telepon wajib diisi')
      isValid = false
    }
    if (password.length < 8) {
      setPasswordError('* Password minimal 8 karakter')
      isValid = false
    }
    setTimeout(() => {
      setNamaError('')
      setEmailError('')
      setNomorTeleponError('')
      setPasswordError('')
    }, 2000)
    if (isValid) {
      alert(
        `Step 1 Berhasil:\nNama: ${namaLengkap}\nEmail: ${email}\nTelepon: ${nomorTelepon}`
      )
      // navigate('/register-bisnis');
    }
  }

  return (
    <div className='p-6 sm:p-8 w-full'>
      <button
        onClick={() => navigate(-1)}
        className='absolute top-4 left-4 sm:top-6 sm:left-6 text-gray-500 hover:text-gray-800 lg:hidden'
        aria-label='Kembali'
      >
        <BackArrowIcon />
      </button>

      <h2 className='text-3xl font-bold text-center text-gray-900 mt-10'>
        WaralabaKita.id
      </h2>
      <p className='text-center text-gray-500 mb-6 mt-1 text-sm'>
        Kembangkan jaringan bisnis Anda bersama kami
      </p>

      <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

      <form onSubmit={handleNextStep} className='space-y-4'>
        {/* ... (Input fields) ... */}
        <InputField
          id='nama_pemilik'
          label='Nama Lengkap'
          type='text'
          placeholder='masukkan nama lengkap'
          value={namaLengkap}
          onChange={e => setNamaLengkap(e.target.value)}
          error={namaError}
        />
        <InputField
          id='email_pemilik'
          label='Alamat Email Bisnis'
          type='email'
          placeholder='masukkan alamat email bisnis'
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={emailError}
        />
        <InputField
          id='telepon_pemilik'
          label='Nomor Telepon'
          type='tel'
          placeholder='masukkan nomor telepon'
          value={nomorTelepon}
          onChange={e => setNomorTelepon(e.target.value)}
          error={nomorTeleponError}
        />
        <InputField
          id='password_pemilik'
          label='Password'
          type={showPassword ? 'text' : 'password'}
          placeholder='**********'
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={passwordError}
          suffix={
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='text-gray-500 hover:text-gray-700'
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          }
        />

        <button
          type='submit'
          className='w-full bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 shadow-lg shadow-teal-500/30'
        >
          Lanjutkan ke Info Bisnis
        </button>
      </form>

      <div className='mt-6 text-center'>
        <p className='text-sm text-gray-600'>
          Sudah punya akun?{' '}
          <Link
            to='/login'
            className='text-teal-600 font-medium hover:underline'
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  )
}

// ===================================================================
// --- 5. Komponen TAB SELECTOR ---
// ===================================================================
function TabSelector ({ activeTab, setActiveTab }) {
  const baseStyle =
    'w-1/2 py-2.5 text-sm font-medium text-center rounded-lg transition-all duration-200'
  const activeStyle = 'bg-teal-500 text-white shadow'
  const inactiveStyle = 'bg-gray-100 text-gray-600 hover:bg-gray-200'

  return (
    <div className='flex space-x-2 bg-gray-100 p-1.5 rounded-lg mb-6'>
      <button
        type='button'
        onClick={() => setActiveTab('pencari')}
        className={`${baseStyle} ${
          activeTab === 'pencari' ? activeStyle : inactiveStyle
        }`}
      >
        Saya Mencari Waralaba
      </button>
      <button
        type='button'
        onClick={() => setActiveTab('pemilik')}
        className={`${baseStyle} ${
          activeTab === 'pemilik' ? activeStyle : inactiveStyle
        }`}
      >
        Saya Pemilik Waralaba
      </button>
    </div>
  )
}