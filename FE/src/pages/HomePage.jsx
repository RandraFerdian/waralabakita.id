// src/pages/HomePage.jsx

import { Link } from 'react-router-dom'

const recommendations = [
  {
    id: 'hambulgel-123',
    name: 'Hambulgel',
    category: 'Makanan & Minuman',
    modal: 170000000,
    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'washy-laundry-456',
    name: 'Washy Laundry',
    category: 'Jasa',
    modal: 80000000,
    img: 'https://images.unsplash.com/photo-1582735689369-389461168172?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
  }
  // ... produk lainnya
]

export default function HomePage () {
  return (
    <div className='container mx-auto max-w-6xl px-4 py-8'>

      <h2 className='text-2xl font-bold mb-4'>Rekomendasi Untuk Anda</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {recommendations.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

/**
 * Komponen Kartu Produk Sederhana
 */
function ProductCard ({ product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className='bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow'
    >
      <img
        src={product.img}
        alt={product.name}
        className='w-full h-40 object-cover'
      />
      <div className='p-4'>
        <p className='text-xs text-gray-500'>{product.category}</p>
        <h3 className='text-lg font-semibold text-gray-900 truncate'>
          {product.name}
        </h3>
        <p className='text-sm text-gray-600 mt-2'>Mulai dari</p>
        <p className='text-lg font-bold text-teal-600'>
          Rp {product.modal.toLocaleString('id-ID')}
        </p>
      </div>
    </Link>
  )
}
