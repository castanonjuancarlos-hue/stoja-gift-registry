'use client'

import { useState } from 'react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setMessage('¡Gracias por suscribirte!')
      setEmail('')
      setTimeout(() => setMessage(''), 3000)
    }
  }
  return (
    <section className="py-16 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="max-w-md">
          <h2 className="text-3xl font-serif mb-6 text-gray-900">
            NEWSLETTER
          </h2>
          <form onSubmit={handleSubmit} className="flex">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
            />
            <button type="submit" className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors">
              SUSCRIBIRSE
            </button>
          </form>
          {message && (
            <p className="mt-4 text-green-600 font-medium">{message}</p>
          )}
        </div>
      </div>
    </section>
  )
}
