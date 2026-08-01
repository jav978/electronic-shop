<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold font-display text-white">Catálogo de Productos</h1>
      <p class="text-slate-400 text-sm mt-1">Explora microcontroladores, placas, sensores y herramientas electrónicas.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Sidebar Filters -->
      <aside class="space-y-6">
        <!-- Search Box -->
        <div class="glass-panel p-5 rounded-2xl">
          <label class="block text-xs font-mono uppercase text-slate-400 mb-2">Buscar Componente</label>
          <div class="relative">
            <input
              v-model="searchTerm"
              @input="debouncedSearch"
              type="text"
              placeholder="Ej: ESP32, OLED, RPi 5..."
              class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        </div>

        <!-- Categories Filter -->
        <div class="glass-panel p-5 rounded-2xl">
          <label class="block text-xs font-mono uppercase text-slate-400 mb-3">Categorías</label>
          <div class="space-y-1.5 text-sm">
            <button
              @click="selectCategory('')"
              class="w-full text-left px-3 py-2 rounded-xl transition-all font-medium flex items-center justify-between"
              :class="!selectedCategory ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'"
            >
              <span>Todas</span>
              <span class="text-xs font-mono">({{ productStore.totalProducts }})</span>
            </button>

            <button
              v-for="cat in productStore.categories"
              :key="cat.id"
              @click="selectCategory(cat.id)"
              class="w-full text-left px-3 py-2 rounded-xl transition-all font-medium flex items-center justify-between"
              :class="selectedCategory === cat.id ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'"
            >
              <span>{{ cat.name }}</span>
            </button>
          </div>
        </div>

        <!-- Stock Filter -->
        <div class="glass-panel p-5 rounded-2xl">
          <label class="block text-xs font-mono uppercase text-slate-400 mb-3">Disponibilidad</label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              v-model="onlyInStock"
              @change="applyFilters"
              class="w-4 h-4 rounded bg-slate-900 border-slate-700 text-brand-500 focus:ring-brand-500"
            />
            <span class="text-sm text-slate-300 font-medium">Solo Disponibles en Stock</span>
          </label>
        </div>
      </aside>

      <!-- Products Grid -->
      <main class="lg:col-span-3">
        <!-- Results count & reset -->
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <span class="text-xs font-mono text-slate-400">
            Mostrando <strong class="text-white">{{ productStore.products.length }}</strong> de <strong class="text-white">{{ productStore.totalProducts }}</strong> resultados
          </span>

          <button v-if="searchTerm || selectedCategory || onlyInStock" @click="resetFilters" class="text-xs text-brand-400 hover:text-brand-300 font-medium">
            Limpiar Filtros
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="productStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="n in 6" :key="n" class="glass-panel rounded-2xl h-80 animate-pulse"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="productStore.products.length === 0" class="glass-panel rounded-2xl p-12 text-center my-10">
          <div class="text-4xl mb-4">🔍</div>
          <h3 class="text-xl font-bold text-white mb-2">No se encontraron productos</h3>
          <p class="text-slate-400 text-sm mb-6">Intenta ajustando los términos de búsqueda o limpiando los filtros seleccionados.</p>
          <button @click="resetFilters" class="px-5 py-2.5 rounded-xl bg-brand-500 text-dark-900 font-bold text-sm">
            Restablecer Filtros
          </button>
        </div>

        <!-- Product Grid -->
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
import { ref, onMounted, watch } from 'vue';
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
