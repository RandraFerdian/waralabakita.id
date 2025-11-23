// src/pages/ProductDetailPage.jsx

import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

// --- (MOCK DATA) ---
const mockProductData = {
  name: 'Hambulgel',
  subtitle: 'Crafted Fresh. Served with Pride.',
  tags: [
    { text: 'Waralaba Tervaforit', color: 'blue' },
    { text: 'Makanan Cepat Saji', color: 'gray' },
    { text: 'Burger', color: 'gray' }
  ],
  views: 1240,
  gallery: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1299&q=80',
    'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=765&q=80'
  ],
  metrics: [
    { label: 'Estimasi Modal', value: 'Rp 170.000.000' },
    { label: 'Franchise Fee', value: 'Rp 25.000.000' },
    { label: 'Biaya Royalti', value: '5% / bulan' },
    { label: 'Estimasi BEP', value: '8-12 bulan' }
  ],
  bannerSlides: [
    {
      title: 'HAMBULGEL',
      subtitle: '"Crafted Fresh. Served with Pride."',
      image:
        'https://images.unsplash.com/photo-1547584370-2cc98b8b8dc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80'
    },
    {
      title: 'Kualitas Premium',
      subtitle: 'Bahan baku segar pilihan terbaik.',
      image:
        'https://images.unsplash.com/photo-1606131731446-5568d87113aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80'
    }
  ],
  tabs: [
    {
      id: 'ringkasan',
      name: 'Ringkasan',
      content: {
        tentang:
          'Hambulgel adalah brand burger lokal dengan cita rasa internasional. Berdiri sejak 2020 di Jakarta, Hambulgel menghadirkan burger berkualitas dengan bahan segar, saus khas, dan rasa yang konsisten. Konsepnya sederhana: makanan cepat saji yang lezat, terjangkau, dan membangkitkan kebanggaan pada produk lokal.',
        targetPasar:
          'Target pasar Hambulgel berfokus pada anak muda dan pekerja urban yang aktif, dinamis, dan gemar mencoba hal baru. Mereka mencari makanan yang cepat disajikan namun tetap memiliki kualitas rasa yang premium. Dengan harga yang terjangkau dan branding modern, Hambulgel hadir sebagai pilihan tepat bagi mereka yang ingin menikmati burger lezat tanpa harus pergi ke restoran mahal.',
        keunggulan: [
          'Rasa khas lokal dengan sentuhan internasional',
          'Bahan segar dan berkualitas',
          'Harga terjangkau',
          'Proses cepat, rasa tetap nikmat',
          'Potensi waralaba tinggi'
        ]
      }
    },
    { id: 'investasi', name: 'Rincian Investasi', content: '...' },
    { id: 'paket', name: 'Paket & Dukungan', content: '...' },
    { id: 'ulasan', name: 'Ulasan', content: '...' }
  ]
}
// --- (END OF MOCK DATA) ---

// --- Helper Ikon (SVG) ---
const HeartIcon = ({ className }) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={2}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z'
    />
  </svg>
)
const WhatsappIcon = ({ className }) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='currentColor'
  >
    <path d='M16.6 14c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.7-.8.9-.1.1-.3.1-.5 0-.7-.3-1.4-.7-2-1.2-.5-.5-1-1.1-1.4-1.7-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.2.3-.3.1-.1.1-.2.1-.4 0-.1 0-1.7-.1-2.3-.1-.6-.8-1-1.1-1-.3 0-.6-.1-.8-.1-.2 0-.5 0-.7.1-.2.1-.6.3-.9.6-.3.3-.9 1-1.2 1.8-.2.8-.2 1.6 0 2.4.2.8 1 1.9 2.1 3 1.5 1.5 2.9 2.8 4.7 3.7 1.9.9 3.6 1.2 5 1.1.9-.1 2.3-.9 2.6-1.8.3-.8.3-1.5.2-1.7-.1-.2-.4-.3-.6-.4z' />
  </svg>
)
const ChevronRightIcon = ({ className }) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={3}
  >
    <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
  </svg>
)
// --- (End of Ikon) ---

export default function ProductDetailPage () {
  // ambil 'productId' dari URL
  const { productId } = useParams()

  // Di aplikasi nyata, Anda akan menggunakan useEffect untuk
  // mengambil data produk berdasarkan productId
  // useEffect(() => {
  //   fetch(`/api/products/${productId}`)
  //     .then(res => res.json())
  //     .then(data => setProduct(data))
  // }, [productId])

  // Untuk demo, tetap pakai mock data
  const product = mockProductData

  return (
    <div className='bg-gray-50/70 pt-8 pb-16'>
      <div className='container mx-auto max-w-6xl px-4'>
        
        {/* --- BAGIAN 1: Galeri & Info Utama --- */}
        <section className='flex flex-col lg:flex-row gap-8 lg:gap-12'>
          <ProductGallery images={product.gallery} />
          <ProductInfo product={product} />
        </section>

        {/* --- BAGIAN 2: Metrik Kunci --- */}
        <section className='my-8'>
          <KeyMetrics metrics={product.metrics} />
        </section>

        {/* --- BAGIAN 3: Banner Carousel --- */}
        <section className='my-8'>
          <ProductBannerCarousel slides={product.bannerSlides} />
        </section>

        {/* --- BAGIAN 4: Tabs Konten --- */}
        <section className='my-8'>
          <ProductTabs tabs={product.tabs} />
        </section>
      </div>
    </div>
  )
}

// --- (Komponen-komponen anak: ProductGallery, ProductInfo, KeyMetrics, dll.) ---
// --- (Salin-tempel SEMUA komponen anak dari prompt Anda sebelumnya ke sini) ---

function ProductGallery ({ images }) {
  const [selectedImage, setSelectedImage] = useState(images[0])

  return (
    <div className='lg:w-1/2 w-full'>
      {/* Gambar Utama */}
      <div className='aspect-w-4 aspect-h-3 w-full overflow-hidden rounded-lg shadow-lg'>
        <img
          src={selectedImage}
          alt='Foto Produk Utama'
          className='w-full h-full object-cover'
        />
      </div>

      {/* Thumbnails */}
      <div className='flex space-x-2 mt-2'>
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(img)}
            className={`w-1/4 aspect-w-4 aspect-h-3 rounded overflow-hidden border-2 transition-all ${
              selectedImage === img
                ? 'border-teal-500 opacity-100'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className='w-full h-full object-cover'
            />
          </button>
        ))}
      </div>
    </div>
  )
}

function ProductInfo ({ product }) {
  return (
    <div className='lg:w-1/2 w-full'>
      {/* Tags */}
      <div className='flex flex-wrap gap-2 mb-2'>
        {product.tags.map((tag, idx) => (
          <span
            key={idx}
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              tag.color === 'blue'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {tag.text}
          </span>
        ))}
      </div>

      {/* Judul & Subjudul */}
      <h1 className='text-4xl font-bold text-gray-900'>{product.name}</h1>
      <p className='text-lg text-gray-500 mt-1 italic'>"{product.subtitle}"</p>

      {/* Dilihat */}
      <p className='text-sm text-gray-500 mt-4'>
        Dilihat oleh {product.views.toLocaleString('id-ID')} orang
      </p>

      {/* Tombol Aksi */}
      <div className='mt-6 flex flex-col sm:flex-row gap-3'>
        <button className='flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-teal-500 text-white font-semibold shadow-lg shadow-teal-500/30 hover:bg-teal-600 transition-colors'>
          <HeartIcon className='w-5 h-5' />
          Simpan ke Favorit
        </button>
        <button className='flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-500 text-white font-semibold shadow-lg shadow-green-500/30 hover:bg-green-600 transition-colors'>
          <WhatsappIcon className='w-5 h-5' />
          Hubungi via WhatsApp
        </button>
      </div>
    </div>
  )
}

function KeyMetrics ({ metrics }) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          className='bg-white p-5 rounded-xl border border-gray-200 shadow-sm'
        >
          <p className='text-sm text-gray-500'>{metric.label}</p>
          <p className='text-2xl font-bold text-gray-900 mt-1'>
            {metric.value}
          </p>
        </div>
      ))}
    </div>
  )
}

function ProductBannerCarousel ({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const activeSlide = slides[currentSlide]

  return (
    <div className='w-full h-64 rounded-xl overflow-hidden shadow-lg relative'>
      <div
        className='w-full h-full bg-cover bg-center transition-all duration-500'
        style={{ backgroundImage: `url(${activeSlide.image})` }}
      />
      <div className='absolute inset-0 bg-black/50' />
      <div className='absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4'>
        <h2 className='text-4xl font-bold'>{activeSlide.title}</h2>
        <p className='text-lg mt-2 italic'>{activeSlide.subtitle}</p>
      </div>
      <button
        onClick={nextSlide}
        className='absolute top-1/2 right-4 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 transition-colors'
      >
        <ChevronRightIcon className='w-6 h-6' />
      </button>
      <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2'>
        {slides.map((_, idx) => (
          <div
            key={idx}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              idx === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function ProductTabs ({ tabs }) {
  const [activeTab, setActiveTab] = useState(tabs[0].id)

  return (
    <div className='w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
      {/* Navigasi Tab */}
      <div className='flex border-b border-gray-200'>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-6 text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Konten Tab */}
      <div className='p-6'>
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={activeTab === tab.id ? 'block' : 'hidden'}
          >
            {tab.id === 'ringkasan' && (
              <div>
                <h3 className='text-xl font-bold text-gray-900'>
                  Tentang {mockProductData.name}
                </h3>
                <p className='text-gray-700 mt-2 leading-relaxed'>
                  {tab.content.tentang}
                </p>

                <h3 className='text-xl font-bold text-gray-900 mt-6'>
                  Target Pasar
                </h3>
                <p className='text-gray-700 mt-2 leading-relaxed'>
                  {tab.content.targetPasar}
                </p>

                <h3 className='text-xl font-bold text-gray-900 mt-6'>
                  Keunggulan Kompetitif
                </h3>
                <ul className='list-disc list-inside text-gray-700 mt-2 space-y-1'>
                  {tab.content.keunggulan.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {tab.id !== 'ringkasan' && (
              <p className='text-gray-500'>
                Konten untuk {tab.name} akan segera hadir...
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
