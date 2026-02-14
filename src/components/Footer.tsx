import { Facebook, Instagram, MessageCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sobre Stoja */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">SOBRE STOJA</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/colecciones" className="hover:text-gray-900">Colecciones</a></li>
              <li><a href="/planes" className="hover:text-gray-900">Planes</a></li>
              <li><a href="/search" className="hover:text-gray-900">Encuentra una Mesa</a></li>
              <li><a href="/nosotras" className="hover:text-gray-900">Nosotras</a></li>
              <li><a href="/preguntas-frecuentes" className="hover:text-gray-900">Preguntas Frecuentes</a></li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">AYUDA</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">¿Cómo hacer tu invitación?</a></li>
              <li><a href="#" className="hover:text-gray-900">¿Cómo hacer tu sitio web?</a></li>
              <li><a href="#" className="hover:text-gray-900">¿Cómo importar invitados a tu evento usando un Archivo CSV?</a></li>
            </ul>
          </div>

          {/* Legales */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">LEGALES</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/aviso-de-privacidad" className="hover:text-gray-900">Aviso de Privacidad</a></li>
              <li><a href="/terminos-y-condiciones" className="hover:text-gray-900">Términos y Condiciones</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/zepikamesaderegalos/" className="text-gray-600 hover:text-gray-900">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://www.instagram.com/zepikamesaderegalos/" className="text-gray-600 hover:text-gray-900">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://wa.me/+525578836437" className="text-gray-600 hover:text-gray-900">
                <MessageCircle className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
