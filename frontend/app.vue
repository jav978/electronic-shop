<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useCartStore } from '~/stores/cart';
import { useThemeStore } from '~/stores/theme';

const themeStore = useThemeStore();

// Dynamically bind <html class="dark"> or <html class="light"> reactively across the entire Nuxt app
useHead({
  htmlAttrs: {
    class: computed(() => themeStore.theme)
  }
});

onMounted(() => {
  useAuthStore().initAuth();
  useCartStore().initCart();
  themeStore.initTheme();
});
</script>
