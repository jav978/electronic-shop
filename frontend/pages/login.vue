<template>
  <div class="max-w-md mx-auto px-4 py-16">
    <div class="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
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
          <input
            v-model="password"
            required
            type="password"
            placeholder="••••••••"
            class="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors"
          />
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
          <span>Cliente: cliente@electrotech.com</span>
          <button @click="fillCredentials('cliente@electrotech.com', 'Cliente123!')" class="text-brand-600 dark:text-brand-400 font-bold hover:underline">Usar</button>
        </div>
        <div class="flex justify-between items-center bg-slate-100 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <span>Admin: admin@electrotech.com</span>
          <button @click="fillCredentials('admin@electrotech.com', 'Admin123!')" class="text-purple-600 dark:text-purple-400 font-bold hover:underline">Usar</button>
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
import { useRouter, useRoute } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
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

    const redirectPath = (route.query.redirect as string) || (res.user.role === 'ADMIN' ? '/admin' : '/profile');
    router.push(redirectPath);
  } catch (err: any) {
    error.value = err.data?.error || 'Credenciales inválidas.';
  } finally {
    loading.value = false;
  }
};
</script>
