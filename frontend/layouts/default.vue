<template>
  <div class="min-h-screen flex flex-col bg-dark-900 text-slate-100">
    <Navbar />
    <main class="flex-grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '~/components/Navbar.vue';
import Footer from '~/components/Footer.vue';
</script>
