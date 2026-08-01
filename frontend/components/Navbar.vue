<template>
  <header class="sticky top-0 z-50 glass-panel border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- Brand Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <div class="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/50 flex items-center justify-center text-brand-400 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all">
          <svg class="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <span class="font-display font-bold text-xl tracking-tight text-white group-hover:text-brand-300 transition-colors">
            ElectroTech <span class="text-brand-500">Studio</span>
          </span>
          <span class="block text-[10px] uppercase font-mono text-slate-400 tracking-wider">Electronics & Hardware</span>
        </div>
      </NuxtLink>

      <!-- Navigation Links -->
      <nav class="hidden md:flex items-center gap-6 text-sm font-medium">
        <NuxtLink to="/" class="text-slate-300 hover:text-brand-400 transition-colors" active-class="text-brand-400 font-semibold">
          Inicio
        </NuxtLink>
        <NuxtLink to="/products" class="text-slate-300 hover:text-brand-400 transition-colors" active-class="text-brand-400 font-semibold">
          Catálogo
        </NuxtLink>
        <NuxtLink v-if="authStore.isAdmin" to="/admin" class="px-2.5 py-1 rounded-md bg-purple-950/60 border border-purple-500/40 text-purple-300 hover:text-white transition-all text-xs font-semibold">
          ⚡ Admin Panel
        </NuxtLink>
      </nav>

      <!-- User Actions & Theme Toggle & Cart -->
      <div class="flex items-center gap-3">
        <!-- Sun/Moon Theme Toggle Button -->
        <button
          type="button"
          @click.prevent="handleToggleTheme"
          class="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition-all border border-slate-700/60 flex items-center justify-center cursor-pointer select-none"
          :title="themeStore.theme === 'dark' ? 'Cambiar a Modo Claro ☀️' : 'Cambiar a Modo Oscuro 🌙'"
        >
          <span v-if="themeStore.theme === 'dark'" class="text-base pointer-events-none">☀️</span>
          <span v-else class="text-base pointer-events-none">🌙</span>
        </button>

        <!-- Cart Button -->
        <NuxtLink to="/cart" class="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-brand-400 transition-all border border-slate-700/60">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <span v-if="cartStore.totalItems > 0" class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-500 text-dark-900 text-xs font-bold flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse">
            {{ cartStore.totalItems }}
          </span>
        </NuxtLink>

        <!-- Profile / Auth -->
        <div v-if="authStore.isLoggedIn" class="flex items-center gap-3">
          <NuxtLink to="/profile" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm border border-slate-700/80">
            <div class="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs">
              {{ authStore.user?.name?.charAt(0).toUpperCase() }}
            </div>
            <span class="max-w-[100px] truncate hidden sm:inline">{{ authStore.user?.name }}</span>
          </NuxtLink>

          <button @click="handleLogout" class="p-2 rounded-lg bg-slate-800/60 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors border border-slate-800" title="Cerrar Sesión">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        <div v-else class="flex items-center gap-2">
          <NuxtLink to="/login" class="px-3.5 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white transition-colors">
            Ingresar
          </NuxtLink>
          <NuxtLink to="/register" class="px-4 py-1.5 rounded-lg text-sm font-semibold bg-brand-500 hover:bg-brand-400 text-dark-900 glow-btn">
            Registro
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useCartStore } from '~/stores/cart';
import { useThemeStore } from '~/stores/theme';

const authStore = useAuthStore();
const cartStore = useCartStore();
const themeStore = useThemeStore();
const router = useRouter();

onMounted(() => {
  authStore.initAuth();
  cartStore.initCart();
  themeStore.initTheme();
});

const handleToggleTheme = () => {
  themeStore.toggleTheme();
};

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>
