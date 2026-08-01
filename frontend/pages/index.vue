<template>
  <div>
    <!-- Hero Section -->
    <section class="relative py-20 overflow-hidden border-b border-slate-800/80">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/30 via-dark-900 to-dark-900 -z-10"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-mono mb-6">
          <span class="w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
          Nuevos Microcontroladores ESP32 & Raspberry Pi 5 Disponibles
        </div>

        <h1 class="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Componentes Electrónicos de Alta Precisión para <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-teal-300 to-indigo-400 text-glow">Creadores e Ingenieros</span>
        </h1>

        <p class="mt-6 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Encuentra microcontroladores, placas base, módulos de sensores I2C/SPI y herramientas profesionales con stock garantizado en tiempo real.
        </p>

        <div class="mt-10 flex flex-wrap justify-center gap-4">
          <NuxtLink to="/products" class="px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-dark-900 font-bold text-base glow-btn flex items-center gap-2">
            Explorar Catálogo ⚡
          </NuxtLink>
          <NuxtLink to="/products?category=microcontroladores" class="px-8 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-medium text-base border border-slate-700">
            Microcontroladores
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Categories Grid -->
    <section class="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold font-display text-white">Categorías Destacadas</h2>
          <p class="text-sm text-slate-400">Componentes clasificados para desarrollo de prototipos</p>
        </div>
        <NuxtLink to="/products" class="text-sm font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1">
          Ver todas →
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="cat in productStore.categories"
          :key="cat.id"
          @click="navigateToCategory(cat.slug)"
          class="glass-panel glass-panel-hover rounded-2xl p-6 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div class="h-32 rounded-xl bg-slate-900 overflow-hidden mb-4 border border-slate-800">
              <img :src="cat.image" :alt="cat.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
            </div>
            <h3 class="font-bold text-lg text-white group-hover:text-brand-300 transition-colors">{{ cat.name }}</h3>
            <p class="text-xs text-slate-400 mt-1 line-clamp-2">{{ cat.description }}</p>
          </div>

          <div class="mt-4 flex items-center justify-between text-xs font-mono text-brand-400 pt-3 border-t border-slate-800/60">
            <span>{{ cat._count?.products || 0 }} Productos</span>
            <span>Explorar →</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16 bg-slate-950/40 border-t border-b border-slate-800/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <span class="text-xs font-mono text-brand-400 uppercase tracking-widest block mb-1">Top Deals</span>
            <h2 class="text-2xl font-bold font-display text-white">Productos Destacados</h2>
          </div>
          <NuxtLink to="/products" class="text-sm font-semibold text-brand-400 hover:text-brand-300">
            Ver Todo →
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            v-for="prod in productStore.featuredProducts"
            :key="prod.id"
            :product="prod"
          />
        </div>
      </div>
    </section>

    <!-- Technical Guarantee Banner -->
    <section class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div class="glass-panel rounded-3xl p-10 border border-brand-500/20 relative overflow-hidden">
        <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <h2 class="text-3xl font-bold font-display text-white mb-4">
          ¿Necesitas asesoría técnica o listas de componentes para proyectos masivos?
        </h2>
        <p class="text-slate-300 max-w-2xl mx-auto text-sm leading-relaxed mb-8">
          Contamos con soporte para universidades, laboratorios makerspace e inventario continuo con reportes automatizados de ventas y stock.
        </p>

        <NuxtLink to="/products" class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-dark-900 font-bold glow-btn">
          Explorar Productos en Stock ⚡
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useProductStore } from '~/stores/product';
import ProductCard from '~/components/ProductCard.vue';

const productStore = useProductStore();
const router = useRouter();

onMounted(() => {
  productStore.fetchCategories();
  productStore.fetchFeaturedProducts();
});

const navigateToCategory = (slug: string) => {
  router.push(`/products?category=${slug}`);
};
</script>
