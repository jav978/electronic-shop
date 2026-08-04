<template>
  <footer class="bg-slate-200/80 dark:bg-dark-950 border-t border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 py-12 mt-20 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      <!-- Brand Section -->
      <div>
        <div class="flex items-center gap-2 mb-4">
          <div class="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/50 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold">
            ⚡
          </div>
          <span class="font-display font-bold text-lg text-slate-900 dark:text-white">ElectroTech Studio</span>
        </div>
        <p class="text-xs leading-relaxed text-slate-600 dark:text-slate-400 mb-3">
          Especialistas en la provisión de microcontroladores, placas de desarrollo, sensores de grado industrial y componentes electrónicos para makers, ingenieros y laboratorios.
        </p>
        <div class="text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>👨‍💻 Desarrollado por: </span>
          <strong class="text-brand-600 dark:text-brand-400 font-bold">José Vásquez</strong>
        </div>
      </div>

      <!-- Quick Navigation -->
      <div>
        <h4 class="text-slate-900 dark:text-white font-bold text-sm mb-3">Categorías Principales</h4>
        <ul class="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
          <li><NuxtLink to="/products?category=microcontroladores-iot" class="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Microcontroladores (ESP32, Arduino)</NuxtLink></li>
          <li><NuxtLink to="/products?category=placas-base-sbc" class="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Placas Base & SBC (Raspberry Pi)</NuxtLink></li>
          <li><NuxtLink to="/products?category=modulos-sensores" class="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Módulos OLED & Sensores</NuxtLink></li>
          <li><NuxtLink to="/products?category=herramientas-laboratorio" class="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Herramientas & Soldadura</NuxtLink></li>
        </ul>
      </div>

      <!-- Developer & Social Links -->
      <div>
        <h4 class="text-slate-900 dark:text-white font-bold text-sm mb-3">Redes & Contacto</h4>
        <ul class="space-y-2.5 text-xs font-medium text-slate-600 dark:text-slate-400">
          <li class="flex items-center gap-2">
            <span class="text-brand-500">📧</span>
            <a href="mailto:jvasquez978@gmail.com" class="hover:text-brand-600 dark:hover:text-brand-400 transition-colors font-mono">jvasquez978@gmail.com</a>
          </li>
          <li class="flex items-center gap-2">
            <span class="text-blue-600 dark:text-blue-400">🌐</span>
            <a href="https://www.facebook.com/jav978" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-mono">Facebook: @jav978</a>
          </li>
          <li class="flex items-center gap-2">
            <span class="text-pink-600 dark:text-pink-400">📸</span>
            <a href="https://www.instagram.com/jav_978/" target="_blank" rel="noopener noreferrer" class="hover:text-pink-600 dark:hover:text-pink-400 transition-colors font-mono">Instagram: @jav_978</a>
          </li>
          <li class="flex items-center gap-2">
            <span class="text-slate-900 dark:text-white">💻</span>
            <a href="https://github.com/jav978" target="_blank" rel="noopener noreferrer" class="hover:text-brand-600 dark:hover:text-brand-400 transition-colors font-mono">GitHub: github.com/jav978</a>
          </li>
        </ul>
      </div>

      <!-- System Telemetry Widget -->
      <div>
        <h4 class="text-slate-900 dark:text-white font-bold text-sm mb-3">Estado del Sistema</h4>
        <div class="p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 text-xs space-y-2 shadow-sm dark:shadow-md">
          <div class="flex justify-between items-center text-slate-700 dark:text-slate-300 font-mono">
            <span>API FeathersJS:</span>
            <span class="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-bold">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> ONLINE
            </span>
          </div>
          <div class="flex justify-between items-center text-slate-700 dark:text-slate-300 font-mono">
            <span>Base de Datos:</span>
            <span class="text-emerald-600 dark:text-emerald-400 font-bold">CONECTADO</span>
          </div>
          <div class="flex justify-between items-center text-slate-700 dark:text-slate-300 font-mono">
            <span>Reportes PDF:</span>
            <span class="text-brand-600 dark:text-brand-400 font-bold">ACTIVO</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-slate-300 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400 font-mono space-y-1">
      <p>© 2026 ElectroTech Studio. Desarrollado por <strong class="text-slate-800 dark:text-slate-200">José Vásquez</strong> (<a href="mailto:jvasquez978@gmail.com" class="text-brand-600 dark:text-brand-400 hover:underline">jvasquez978@gmail.com</a>). Todos los derechos reservados.</p>
      <p class="text-[11px] text-slate-400 dark:text-slate-500">Impulsado por Nuxt 3, Pinia, FeathersJS, Prisma & PostgreSQL.</p>
    </div>
  </footer>
</template>
