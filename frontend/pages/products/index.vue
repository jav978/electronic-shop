<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
    <!-- Page Header -->
    <div class="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">Catálogo de Componentes</h1>
          <p class="text-slate-600 dark:text-slate-400 text-sm mt-1">Explora nuestra colección de microcontroladores, sensores, placas base y herramientas con stock en tiempo real.</p>
        </div>

        <div class="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
          <span>⚡ Total Productos:</span>
          <strong class="text-slate-900 dark:text-white font-bold">{{ productStore.totalProducts }}</strong>
        </div>
      </div>
    </div>

    <!-- Main Content Layout Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
      <!-- Sticky Sidebar Filters -->
      <aside class="space-y-6 lg:sticky lg:top-24">
        <!-- Search Box -->
        <div class="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <label class="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-2 font-bold">🔍 Buscar Componente</label>
          <div class="relative">
            <input
              v-model="searchTerm"
              @input="debouncedSearch"
              type="text"
              placeholder="Ej: ESP32, OLED, RPi 5..."
              class="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        </div>

        <!-- Categories Filter List -->
        <div class="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <label class="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-bold">🏷️ Categorías</label>
            <span v-if="selectedCategory" @click="selectCategory('')" class="text-[11px] text-brand-600 dark:text-brand-400 hover:underline cursor-pointer font-medium">Ver Todas</span>
          </div>
          
          <div class="space-y-1.5 text-sm max-h-[320px] overflow-y-auto pr-1">
            <button
              @click="selectCategory('')"
              class="w-full text-left px-3 py-2 rounded-xl transition-all font-medium flex items-center justify-between text-xs"
              :class="!selectedCategory ? 'bg-brand-500/20 text-brand-700 dark:text-brand-300 border border-brand-500/40 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'"
            >
              <span>Todas las Categorías</span>
              <span class="text-xs font-mono text-slate-500 dark:text-slate-400">({{ productStore.totalProducts }})</span>
            </button>

            <button
              v-for="cat in productStore.categories"
              :key="cat.id"
              @click="selectCategory(cat.id)"
              class="w-full text-left px-3 py-2 rounded-xl transition-all font-medium flex items-center justify-between text-xs"
              :class="selectedCategory === cat.id ? 'bg-brand-500/20 text-brand-700 dark:text-brand-300 border border-brand-500/40 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'"
            >
              <span class="truncate">{{ cat.name }}</span>
            </button>
          </div>
        </div>

        <!-- Stock Filter -->
        <div class="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <label class="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-3 font-bold">📦 Disponibilidad</label>
          <label class="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              v-model="onlyInStock"
              @change="applyFilters"
              class="w-4 h-4 rounded bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-brand-500 focus:ring-brand-500 cursor-pointer"
            />
            <span class="text-xs text-slate-800 dark:text-slate-200 font-medium">Solo productos en Stock</span>
          </label>
        </div>

        <!-- Reset Button -->
        <button
          v-if="searchTerm || selectedCategory || onlyInStock"
          @click="resetFilters"
          class="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
        >
          <span>✕ Limpiar Todos los Filtros</span>
        </button>
      </aside>

      <!-- Products Grid Area -->
      <main class="lg:col-span-3">
        <!-- Results Counter Bar -->
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <span class="text-xs font-mono text-slate-600 dark:text-slate-400">
            Mostrando <strong class="text-slate-900 dark:text-white font-bold">{{ productStore.products.length }}</strong> productos en esta vista
          </span>
        </div>

        <!-- Loading Skeleton -->
        <div v-if="productStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="n in 6" :key="n" class="glass-panel rounded-2xl h-80 animate-pulse border border-slate-200 dark:border-slate-800"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="productStore.products.length === 0" class="glass-panel rounded-2xl p-12 text-center my-6 border border-slate-200 dark:border-slate-800">
          <div class="text-5xl mb-4">🔍</div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">No se encontraron productos</h3>
          <p class="text-slate-600 dark:text-slate-400 text-sm mb-6">No hay ítems que coincidan con los filtros seleccionados.</p>
          <button @click="resetFilters" class="px-6 py-2.5 rounded-xl bg-brand-500 text-dark-900 font-bold text-xs glow-btn">
            Restablecer Filtros
          </button>
        </div>

        <!-- Product Cards Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            v-for="prod in productStore.products"
            :key="prod.id"
            :product="prod"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '~/stores/product';
import ProductCard from '~/components/ProductCard.vue';

const productStore = useProductStore();
const route = useRoute();
const router = useRouter();

const searchTerm = ref((route.query.search as string) || '');
const selectedCategory = ref((route.query.category as string) || '');
const onlyInStock = ref(route.query.inStock === 'true');

let searchTimeout: any = null;

onMounted(async () => {
  await productStore.fetchCategories();
  
  // If route query has category slug instead of ID, resolve it
  if (selectedCategory.value) {
    const cat = productStore.categories.find(c => c.slug === selectedCategory.value || c.id === selectedCategory.value);
    if (cat) selectedCategory.value = cat.id;
  }

  applyFilters();
});

const applyFilters = () => {
  const query: Record<string, any> = {};
  if (searchTerm.value) query.search = searchTerm.value;
  if (selectedCategory.value) query.categoryId = selectedCategory.value;
  if (onlyInStock.value) query.inStock = 'true';

  productStore.fetchProducts(query);
};

const selectCategory = (catId: string) => {
  selectedCategory.value = catId;
  applyFilters();
};

const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 400);
};

const resetFilters = () => {
  searchTerm.value = '';
  selectedCategory.value = '';
  onlyInStock.value = false;
  applyFilters();
};
</script>
