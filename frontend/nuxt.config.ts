export default defineNuxtConfig({
  compatibilityDate: '2026-07-31',
  css: [
    '~/assets/css/main.css'
  ],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3030/api'
    }
  },
  app: {
    head: {
      title: 'ElectroTech Studio - Tienda de Componentes Electrónicos & Microcontroladores',
      meta: [
        { name: 'description', content: 'Venta de microcontroladores ESP32, Arduino, Raspberry Pi, placas base, sensores y herramientas de electrónica.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800&display=swap' }
      ]
    }
  },
  tailwindcss: {
    exposeConfig: true,
    viewer: false
  }
})
