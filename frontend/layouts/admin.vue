<template>
  <div class="min-h-screen flex bg-dark-900 text-slate-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-dark-950 border-r border-slate-800 flex flex-col justify-between hidden md:flex">
      <div>
        <!-- Sidebar Brand -->
        <div class="p-6 border-b border-slate-800">
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-400 font-bold">
              ⚡
            </div>
            <div>
              <span class="font-display font-bold text-lg text-white">Electro<span class="text-purple-400">Admin</span></span>
              <span class="block text-[10px] font-mono text-purple-300">Control Panel v1.0</span>
            </div>
          </NuxtLink>
        </div>

        <!-- Navigation Menu -->
        <nav class="p-4 space-y-1">
          <NuxtLink
            to="/admin"
            exact
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
            active-class="bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
            inactive-class="text-slate-400 hover:bg-slate-900 hover:text-slate-200"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard General
          </NuxtLink>

          <NuxtLink
            to="/admin/products"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
            active-class="bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
            inactive-class="text-slate-400 hover:bg-slate-900 hover:text-slate-200"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Inventario & Productos
          </NuxtLink>

          <NuxtLink
            to="/admin/orders"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
            active-class="bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
            inactive-class="text-slate-400 hover:bg-slate-900 hover:text-slate-200"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Gestión de Pedidos
          </NuxtLink>

          <NuxtLink
            to="/admin/reports"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
            active-class="bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
            inactive-class="text-slate-400 hover:bg-slate-900 hover:text-slate-200"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Reportes & PDF
          </NuxtLink>
        </nav>
      </div>

      <!-- Footer Quick Action -->
      <div class="p-4 border-t border-slate-800">
        <NuxtLink to="/" class="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-800">
          ← Volver a la Tienda
        </NuxtLink>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-grow flex flex-col min-w-0">
      <header class="h-16 border-b border-slate-800 glass-panel px-6 flex items-center justify-between">
        <h2 class="text-sm font-mono text-purple-400 uppercase tracking-wider flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span> Panel Administrativo
        </h2>

        <div class="flex items-center gap-3">
          <!-- Sun/Moon Theme Toggle Button -->
          <button
            type="button"
            @click.prevent="handleToggleTheme"
            class="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition-all border border-slate-700/60 flex items-center justify-center cursor-pointer select-none"
            :title="themeStore.theme === 'dark' ? 'Cambiar a Modo Claro ☀️' : 'Cambiar a Modo Oscuro 🌙'"
          >
            <span v-if="themeStore.theme === 'dark'" class="text-sm pointer-events-none">☀️</span>
            <span v-else class="text-sm pointer-events-none">🌙</span>
          </button>

          <span class="text-xs text-slate-400 hidden sm:inline">{{ authStore.user?.email }}</span>
          <span class="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold uppercase">
            ADMIN
          </span>
        </div>
      </header>

      <main class="p-6 md:p-8 flex-grow overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useThemeStore } from '~/stores/theme';

const authStore = useAuthStore();
const themeStore = useThemeStore();
const router = useRouter();

onMounted(() => {
  authStore.initAuth();
  themeStore.initTheme();
  if (!authStore.isAdmin) {
    router.push('/login');
  }
});

const handleToggleTheme = () => {
  themeStore.toggleTheme();
};
</script>
