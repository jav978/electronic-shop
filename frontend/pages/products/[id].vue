<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-xs font-mono text-slate-400 mb-8">
      <NuxtLink to="/" class="hover:text-white">Inicio</NuxtLink>
      <span>/</span>
      <NuxtLink to="/products" class="hover:text-white">Catálogo</NuxtLink>
      <span>/</span>
      <span class="text-brand-400 truncate">{{ product?.name || 'Cargando...' }}</span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="glass-panel p-12 rounded-3xl animate-pulse h-96"></div>

    <!-- Product Not Found -->
    <div v-else-if="!product" class="glass-panel p-12 rounded-3xl text-center">
      <div class="text-4xl mb-4">⚠️</div>
      <h2 class="text-2xl font-bold text-white mb-2">Producto No Encontrado</h2>
      <p class="text-slate-400 text-sm mb-6">El producto solicitado no existe o ha sido descontinuado.</p>
      <NuxtLink to="/products" class="px-6 py-3 rounded-xl bg-brand-500 text-dark-900 font-bold text-sm">
        Volver al Catálogo
      </NuxtLink>
    </div>

    <!-- Product View -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Product Image Showcase -->
      <div class="glass-panel rounded-3xl p-8 flex items-center justify-center bg-slate-950/80 border border-slate-800 relative">
        <img
          :src="product.image"
          :alt="product.name"
          class="max-h-96 w-auto object-contain hover:scale-105 transition-transform duration-500"
          @error="handleImageError"
        />

        <div class="absolute top-4 left-4">
          <span
            v-if="product.stock > 10"
            class="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
          >
            ✓ Stock Disponible ({{ product.stock }} unidades)
          </span>
          <span
            v-else-if="product.stock > 0"
            class="px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
          >
            ⚠️ Stock Crítico ({{ product.stock }} restantes)
          </span>
          <span
            v-else
            class="px-3 py-1 rounded-full text-xs font-bold uppercase bg-red-500/20 text-red-300 border border-red-500/40"
          >
            ❌ Sin Stock
          </span>
        </div>
      </div>

      <!-- Product Information -->
      <div class="flex flex-col justify-between">
        <div>
          <span class="text-xs font-mono uppercase text-brand-400 tracking-wider block mb-2">
            SKU: {{ product.sku }} | Categoría: {{ product.category?.name }}
          </span>

          <h1 class="text-3xl font-extrabold font-display text-white mb-4 leading-tight">
            {{ product.name }}
          </h1>

          <div class="text-3xl font-bold font-display text-white mb-6 flex items-baseline gap-2">
            <span>${{ product.price.toFixed(2) }}</span>
            <span class="text-xs font-mono text-slate-400">USD (Impuestos no incl.)</span>
          </div>

          <p class="text-slate-300 text-sm leading-relaxed mb-8 border-t border-b border-slate-800 py-4">
            {{ product.description }}
          </p>

          <!-- Specifications Table -->
          <div v-if="product.specifications" class="mb-8">
            <h3 class="text-sm font-mono uppercase text-slate-400 mb-3 flex items-center gap-2">
              <span>⚙️ Especificaciones Técnicas</span>
            </h3>
            <div class="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-2">
              <div
                v-for="(val, key) in Object.entries(product.specifications)"
                :key="key"
                class="flex justify-between items-center text-xs py-1.5 border-b border-slate-800/60 last:border-0"
              >
                <span class="text-slate-400 font-mono">{{ val[0] }}</span>
                <span class="text-slate-100 font-semibold font-mono">{{ val[1] }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Add to Cart Controls -->
        <div class="glass-panel p-6 rounded-2xl space-y-4">
          <div class="flex items-center gap-4">
            <label class="text-xs font-mono text-slate-400 uppercase">Cantidad:</label>
            <div class="flex items-center bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
              <button
                @click="quantity = Math.max(1, quantity - 1)"
                class="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800"
              >
                -
              </button>
              <span class="px-4 py-1.5 text-sm font-bold font-mono text-white">{{ quantity }}</span>
              <button
                @click="quantity = Math.min(product.stock, quantity + 1)"
                class="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800"
              >
                +
              </button>
            </div>
          </div>

          <button
            @click="handleAddToCart"
            :disabled="product.stock <= 0"
            class="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl"
            :class="added
              ? 'bg-emerald-500 text-dark-900'
              : product.stock > 0
                ? 'bg-brand-500 hover:bg-brand-400 text-dark-900 glow-btn'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'"
          >
            <span>{{ added ? '¡Añadido al Carrito!' : (product.stock > 0 ? `Agregar ${quantity} al Carrito ($${(product.price * quantity).toFixed(2)})` : 'Agotado Temporalmente') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore, type Product } from '~/stores/product';
import { useCartStore } from '~/stores/cart';

const route = useRoute();
const productStore = useProductStore();
const cartStore = useCartStore();

const product = ref<Product | null>(null);
const loading = ref(true);
const quantity = ref(1);
const added = ref(false);

onMounted(async () => {
  const id = route.params.id as string;
  product.value = await productStore.getProductBySlugOrId(id);
  loading.value = false;
});

const handleAddToCart = () => {
  if (product.value && product.value.stock > 0) {
    cartStore.addItem(product.value, quantity.value);
    added.value = true;
    setTimeout(() => {
      added.value = false;
    }, 1500);
  }
};

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80';
};
</script>
