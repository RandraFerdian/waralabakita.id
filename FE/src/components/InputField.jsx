// components/InputField.js

export default function InputField ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  suffix,
  ...props
}) {
  const hasError = !!error 

  return (
    <div>
      {/* Label yang terhubung ke input via 'id' untuk accessibility */}
      <label
        htmlFor={id}
        className='block text-sm font-medium text-gray-700 mb-1'
      >
        {label}
      </label>

      {/* Wrapper 'relative' dibutuhkan jika ada ikon suffix */}
      <div className='relative'>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
          className={`w-full px-4 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
            hasError
              ? 'border-red-500 focus:ring-red-500' // Style jika error
              : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500' // Style normal
          } ${
            suffix ? 'pr-10' : ''
          }`}
        />

        {/* Render suffix (ikon) jika ada */}
        {suffix && (
          <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
            {suffix}
          </div>
        )}
      </div>

      {/* Tampilkan pesan error jika ada */}
      {hasError && (
        <p className='text-red-500 text-xs mt-1'>{error}</p>
      )}
    </div>
  )
}