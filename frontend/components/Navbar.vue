<template>
  <header class="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- Brand Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 group shrink-0">
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-500/20 border border-brand-500/50 flex items-center justify-center text-brand-500 dark:text-brand-400 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all">
          <svg class="w-5 h-5 sm:w-6 sm:h-6 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div class="flex flex-col">
          <span class="font-display font-bold text-base sm:text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors leading-none">
            ElectroTech <span class="text-brand-500">Studio</span>
          </span>
          <span class="text-[9px] sm:text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 tracking-wider hidden xs:block mt-0.5">Electronics & Hardware</span>
        </div>
      </NuxtLink>

      <!-- Desktop Navigation Links -->
      <nav class="hidden md:flex items-center gap-6 text-sm font-medium">
        <NuxtLink to="/" class="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors" active-class="text-brand-600 dark:text-brand-400 font-semibold">
          Inicio
        </NuxtLink>
        <NuxtLink to="/products" class="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors" active-class="text-brand-600 dark:text-brand-400 font-semibold">
          Catálogo
        </NuxtLink>
        <NuxtLink v-if="authStore.isAdmin" to="/admin" class="px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-500/40 text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-white transition-all text-xs font-semibold">
          ⚡ Admin Panel
        </NuxtLink>
      </nav>

      <!-- User Actions & Theme Toggle & Cart -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Sun/Moon Theme Toggle Button -->
        <button
          type="button"
          @click.prevent="handleToggleTheme"
          class="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-500 dark:text-amber-400 transition-all border border-slate-200 dark:border-slate-700/60 flex items-center justify-center cursor-pointer select-none"
          :title="themeStore.theme === 'dark' ? 'Cambiar a Modo Claro ☀️' : 'Cambiar a Modo Oscuro 🌙'"
        >
          <span v-if="themeStore.theme === 'dark'" class="text-sm sm:text-base pointer-events-none">☀️</span>
          <span v-else class="text-sm sm:text-base pointer-events-none">🌙</span>
        </button>

        <!-- Cart Button -->
        <NuxtLink to="/cart" class="relative p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-all border border-slate-200 dark:border-slate-700/60">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <span v-if="cartStore.totalItems > 0" class="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-brand-500 text-dark-900 text-[10px] sm:text-xs font-bold flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse">
            {{ cartStore.totalItems }}
          </span>
        </NuxtLink>

        <!-- Desktop Profile / Auth -->
        <div v-if="authStore.isLoggedIn" class="hidden md:flex items-center gap-3">
          <NuxtLink to="/profile" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm border border-slate-200 dark:border-slate-700/80">
            <div class="w-6 h-6 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs">
              {{ authStore.user?.name?.charAt(0).toUpperCase() }}
            </div>
            <span class="max-w-[100px] truncate inline">{{ authStore.user?.name }}</span>
          </NuxtLink>

          <button @click="handleLogout" class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/60 hover:bg-red-100 dark:hover:bg-red-950/60 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors border border-slate-200 dark:border-slate-800" title="Cerrar Sesión">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        <div v-else class="hidden md:flex items-center gap-2">
          <NuxtLink to="/login" class="px-3.5 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
            Ingresar
          </NuxtLink>
          <NuxtLink to="/register" class="px-4 py-1.5 rounded-lg text-sm font-semibold bg-brand-500 hover:bg-brand-400 text-dark-900 glow-btn">
            Registro
          </NuxtLink>
        </div>

        <!-- Mobile Hamburger Menu Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60 transition-colors"
          aria-label="Abrir menú"
        >
          <svg v-if="!mobileMenuOpen" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Collapsible Menu Drawer -->
    <div
      v-if="mobileMenuOpen"
      class="md:hidden border-t border-slate-200 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 py-4 space-y-3"
    >
      <NuxtLink
        to="/"
        @click="mobileMenuOpen = false"
        class="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
      >
        🏠 Inicio
      </NuxtLink>

      <NuxtLink
        to="/products"
        @click="mobileMenuOpen = false"
        class="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
      >
        📦 Catálogo de Productos
      </NuxtLink>

      <NuxtLink
        v-if="authStore.isAdmin"
        to="/admin"
        @click="mobileMenuOpen = false"
        class="block px-3 py-2 rounded-xl text-sm font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-500/40"
      >
        ⚡ Admin Panel
      </NuxtLink>

      <div class="border-t border-slate-200 dark:border-slate-800 pt-3">
        <div v-if="authStore.isLoggedIn" class="space-y-2">
          <NuxtLink
            to="/profile"
            @click="mobileMenuOpen = false"
            class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 bg-slate-200/60 dark:bg-slate-800"
          >
            <div class="w-6 h-6 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs">
              {{ authStore.user?.name?.charAt(0).toUpperCase() }}
            </div>
            <span>{{ authStore.user?.name }} (Mi Perfil)</span>
          </NuxtLink>

          <button
            @click="handleLogout(); mobileMenuOpen = false"
            class="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Cerrar Sesión</span>
          </button>
        </div>

        <div v-else class="grid grid-cols-2 gap-2">
          <NuxtLink
            to="/login"
            @click="mobileMenuOpen = false"
            class="text-center py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-800"
          >
            Ingresar
          </NuxtLink>
          <NuxtLink
            to="/register"
            @click="mobileMenuOpen = false"
            class="text-center py-2.5 rounded-xl text-sm font-bold text-dark-900 bg-brand-500 hover:bg-brand-400 glow-btn"
          >
            Registro
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useCartStore } from '~/stores/cart';
import { useThemeStore } from '~/stores/theme';

const authStore = useAuthStore();
const cartStore = useCartStore();
const themeStore = useThemeStore();
const router = useRouter();

const mobileMenuOpen = ref(false);

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
