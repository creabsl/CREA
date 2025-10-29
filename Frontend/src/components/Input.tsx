import type { InputHTMLAttributes, ReactNode } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
}

export default function Input({ label, hint, error, className = '', id, ...rest }: Props) {
  const inputId = id || Math.random().toString(36).slice(2)
  return (
    <div className="w-full">
      {label && (
  <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
  className={`input ${className}`}
        {...rest}
      />
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )}
