// src/components/Header.jsx

import { Link } from 'react-router-dom'

const SearchIcon = () => (
  <svg className='w-5 h-5' /* ... */ fill='currentColor' viewBox='0 0 20 20'>
    <path
      fillRule='evenodd'
      d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
      clipRule='evenodd'
    />
  </svg>
)
const BellIcon = () => (
  <svg className='w-6 h-6' /* ... */ fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341A6.002 6.002 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
    />
  </svg>
)
const HeartIcon = () => (
  <svg className='w-6 h-6' /* ... */ fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z'
    />
  </svg>
)

export default function Header () {
  return (
    <header className='bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50'>
      <nav className='container mx-auto max-w-6xl px-4 py-3'>
        <div className='flex justify-between items-center'>
          {/* Kiri: Logo & Navigasi */}
          <div className='flex items-center gap-6'>
            <Link to='/' className='text-xl font-bold text-teal-600'>
              WaralabaKita.id
            </Link>
            <div className='hidden md:flex gap-4'>
              <Link to='/' className='text-sm text-gray-600 hover:text-teal-600'>
                Home
              </Link>
              <Link to='/kategori' className='text-sm text-gray-600 hover:text-teal-600'>
                Kategori
              </Link>
            </div>
          </div>

          {/* Tengah: Search Bar (Desktop) */}
          <div className='hidden lg:flex flex-1 max-w-lg mx-4'>
            <div className='relative w-full'>
              <input
                type='search'
                placeholder='Cari nama, kategori, atau modal waralaba...'
                className='w-full px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-500'
              />
              <button className='absolute right-0 top-0 h-full px-3 bg-teal-600 text-white rounded-r-full flex items-center justify-center hover:bg-teal-700'>
                <SearchIcon />
              </button>
            </div>
          </div>

          {/* Kanan: Ikon & User */}
          <div className='flex items-center gap-4'>
            <button className='text-gray-500 hover:text-teal-600'>
              <BellIcon />
            </button>
            <button className='text-gray-500 hover:text-teal-600'>
              <HeartIcon />
            </button>
            <div className='flex items-center gap-2 border-l pl-4'>
              <img
                src='https://i.pravatar.cc/40?u=budisentosa'
                alt='Budi Sentosa'
                className='w-8 h-8 rounded-full'
              />
              <span className='hidden md:block text-sm font-medium text-gray-700'>
                Budi Sentosa
              </span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}