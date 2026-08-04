<template>
  <div class="max-w-md mx-auto px-4 py-12 sm:py-16">
    <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
      <div class="text-center">
        <div class="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/50 flex items-center justify-center text-brand-600 dark:text-brand-400 mx-auto mb-3 text-xl font-bold">
          ⚡
        </div>
        <h1 class="text-2xl font-bold font-display text-slate-900 dark:text-white">Iniciar Sesión</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Accede a tu perfil de ElectroTech Studio</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">Correo Electrónico</label>
          <input
            v-model="email"
            required
            type="email"
            placeholder="usuario@electrotech.com"
            class="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        <div>
          <label class="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">Contraseña</label>
          <div class="relative">
            <input
              v-model="password"
              required
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl pl-4 pr-11 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
              :title="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.018 10.018 0 013.682-.763c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-6.165-4.165a3 3 0 004.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="error" class="p-3 rounded-xl bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 text-xs text-red-700 dark:text-red-300">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3.5 rounded-xl font-bold text-sm bg-brand-500 hover:bg-brand-400 text-dark-900 glow-btn flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="w-4 h-4 rounded-full border-2 border-dark-900 border-t-transparent animate-spin"></span>
          <span>{{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}</span>
        </button>
      </form>

      <!-- Demo Accounts Helper -->
      <div class="border-t border-slate-200 dark:border-slate-800 pt-4 text-xs font-mono text-slate-500 dark:text-slate-400 space-y-2">
        <p class="text-slate-800 dark:text-slate-300 font-bold">💡 Cuentas de Prueba:</p>
        <div class="flex justify-between items-center bg-slate-100 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <span class="truncate pr-2">Cliente: cliente@electrotech.com</span>
          <button @click="fillCredentials('cliente@electrotech.com', 'Cliente123!')" class="text-brand-600 dark:text-brand-400 font-bold hover:underline shrink-0">Usar</button>
        </div>
        <div class="flex justify-between items-center bg-slate-100 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <span class="truncate pr-2">Admin: admin@electrotech.com</span>
          <button @click="fillCredentials('admin@electrotech.com', 'Admin123!')" class="text-purple-600 dark:text-purple-400 font-bold hover:underline shrink-0">Usar</button>
        </div>
      </div>

      <p class="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
        ¿No tienes cuenta?
        <NuxtLink to="/register" class="text-brand-600 dark:text-brand-400 font-bold hover:underline">Regístrate aquí</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useToast } from '~/composables/useToast';
import { useRouter, useRoute } from 'vue-router';

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

const fillCredentials = (e: string, p: string) => {
  email.value = e;
  password.value = p;
};

const handleLogin = async () => {
  loading.value = true;
  error.value = null;
  const config = useRuntimeConfig();

  try {
    const res = await $fetch<any>(`${config.public.apiBase}/users/login`, {
      method: 'POST',
      body: { email: email.value, password: password.value }
    });

    authStore.setAuth(res.user, res.token);
    toast.success('¡Bienvenido!', `Hola ${res.user.name}, has iniciado sesión correctamente.`);

    const redirectPath = (route.query.redirect as string) || (res.user.role === 'ADMIN' ? '/admin' : '/profile');
    router.push(redirectPath);
  } catch (err: any) {
    const errMsg = err.data?.error || 'Credenciales inválidas.';
    error.value = errMsg;
    toast.error('Error de Inicio de Sesión', errMsg);
  } finally {
    loading.value = false;
  }
};
</script>
