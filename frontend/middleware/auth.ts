import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuthStore } from '~/stores/auth';
import { useToast } from '~/composables/useToast';

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  const toast = useToast();

  if (import.meta.client) {
    authStore.initAuth();
  }

  if (!authStore.isLoggedIn) {
    if (import.meta.client) {
      toast.warning('Acceso Restringido', 'Debes iniciar sesión para ingresar a esta sección.');
    }
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }
});
