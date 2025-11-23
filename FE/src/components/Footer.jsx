// src/components/Footer.jsx

export default function Footer () {
  return (
    <footer className='bg-gray-800 text-gray-300'>
      <div className='container mx-auto max-w-6xl px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Kolom 1: Perusahaan */}
          <div>
            <h5 className='font-bold text-white mb-3'>Perusahaan</h5>
            <ul className='space-y-2'>
              <li>
                <a href='#' className='text-sm hover:underline'>
                  Tentang WaralabaKita.id
                </a>
              </li>
              <li>
                <a href='#' className='text-sm hover:underline'>
                  Sejarah
                </a>
              </li>
              <li>
                <a href='#' className='text-sm hover:underline'>
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 2: Produk */}
          <div>
            <h5 className='font-bold text-white mb-3'>Produk</h5>
            <ul className='space-y-2'>
              <li>
                <a href='#' className='text-sm hover:underline'>
                  Ekplor Bisnis
                </a>
              </li>
              <li>
                <a href='#' className='text-sm hover:underline'>
                  Kategori
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3 & 4: Kontak */}
          <div className='md:col-span-2'>
            <h5 className='font-bold text-xl text-teal-400 mb-3'>
              WaralabaKita.id
            </h5>
            <p className='text-sm italic'>"Ekosistem Waralaba Terpercaya di Indonesia"</p>
            <div className='mt-4 space-y-2'>
              <p className='text-sm font-medium'>Kontak Kami</p>
              <div className='flex items-center gap-2 text-sm'>
                {/* (Ikon Email) */}
                <span>@waralabakita.id</span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                {/* (Ikon Telepon) */}
                <span>0899-0000-0000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Garis Bawah */}
        <div className='border-t border-gray-700 mt-8 pt-6 text-center text-sm'>
          <p>
            © 2025 WaralabaKita.id. PT Inovasi Digital Nusantara. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}