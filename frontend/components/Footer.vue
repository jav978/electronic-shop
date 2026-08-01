<template>
  <footer class="bg-slate-100 dark:bg-dark-950 border-t border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 py-12 mt-20 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <div class="flex items-center gap-2 mb-4">
          <div class="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/50 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold">
            ⚡
          </div>
          <span class="font-display font-bold text-lg text-slate-900 dark:text-white">ElectroTech Studio</span>
        </div>
        <p class="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          Especialistas en la provisión de microcontroladores, placas de desarrollo, sensores de grado industrial y componentes electrónicos para makers, ingenieros y laboratorios.
        </p>
      </div>

      <div>
        <h4 class="text-slate-900 dark:text-white font-semibold text-sm mb-3">Categorías Principales</h4>
        <ul class="space-y-2 text-xs">
          <li><NuxtLink to="/products?category=microcontroladores" class="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Microcontroladores (ESP32, Arduino)</NuxtLink></li>
          <li><NuxtLink to="/products?category=placas-base-sbc" class="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Placas Base & SBC (Raspberry Pi)</NuxtLink></li>
          <li><NuxtLink to="/products?category=modulos-sensores" class="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Módulos OLED & Sensores</NuxtLink></li>
          <li><NuxtLink to="/products?category=herramientas-electronica" class="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Herramientas & Soldadura</NuxtLink></li>
        </ul>
      </div>

      <div>
        <h4 class="text-slate-900 dark:text-white font-semibold text-sm mb-3">Garantía & Envíos</h4>
        <ul class="space-y-2 text-xs">
          <li class="flex items-center gap-2">
            <span class="text-emerald-600 dark:text-emerald-400">✓</span> Garantía de fábrica en chips y placas
          </li>
          <li class="flex items-center gap-2">
            <span class="text-emerald-600 dark:text-emerald-400">✓</span> Despachos express con seguimiento
          </li>
          <li class="flex items-center gap-2">
            <span class="text-emerald-600 dark:text-emerald-400">✓</span> Asistencia técnica de componentes
          </li>
        </ul>
      </div>

      <div>
        <h4 class="text-slate-900 dark:text-white font-semibold text-sm mb-3">Estado del Sistema</h4>
        <div class="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2 shadow-sm dark:shadow-none">
          <div class="flex justify-between items-center">
            <span>API FeathersJS:</span>
            <span class="text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1 font-semibold">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> ONLINE
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span>Base de Datos PostgreSQL:</span>
            <span class="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">CONECTADO</span>
          </div>
          <div class="flex justify-between items-center">
            <span>Reportes PDF Engine:</span>
            <span class="text-brand-600 dark:text-brand-400 font-mono font-semibold">ACTIVO</span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-slate-200 dark:border-slate-800/60 text-center text-xs text-slate-500">
      © 2026 ElectroTech Studio. Todos los derechos reservados. Impulsado por Nuxt 3, Pinia, FeathersJS, Prisma & PostgreSQL.
    </div>
  </footer>
</template>
