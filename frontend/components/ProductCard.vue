<template>
  <div class="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between group relative">
    <div>
      <!-- Product Image with Badge -->
      <div class="relative h-48 bg-slate-950/80 overflow-hidden flex items-center justify-center p-4">
        <img
          :src="product.image"
          :alt="product.name"
          class="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500"
          @error="handleImageError"
        />

        <!-- Stock Status Badge -->
        <div class="absolute top-3 left-3 flex flex-col gap-1">
          <span
            v-if="product.stock > 10"
            class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
          >
            En Stock ({{ product.stock }})
          </span>
          <span
            v-else-if="product.stock > 0"
            class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
          >
            ¡Bajo Stock! ({{ product.stock }})
          </span>
          <span
            v-else
            class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-red-500/20 text-red-300 border border-red-500/40"
          >
            Agotado
          </span>
        </div>

        <!-- Featured Badge -->
        <span
          v-if="product.featured"
          class="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-brand-500/30 text-brand-300 border border-brand-500/50"
        >
          ⚡ Top Deal
        </span>
      </div>

      <!-- Content -->
      <div class="p-5">
        <span class="text-[11px] font-mono text-brand-400 uppercase tracking-wider block mb-1">
          {{ product.category?.name || 'Electrónica' }}
        </span>

        <NuxtLink :to="`/products/${product.slug || product.id}`" class="block">
          <h3 class="font-bold text-white text-base leading-snug group-hover:text-brand-300 transition-colors line-clamp-2">
            {{ product.name }}
          </h3>
        </NuxtLink>

        <!-- Specifications Preview -->
        <div v-if="product.specifications" class="mt-3 grid grid-cols-2 gap-1.5 text-[11px] text-slate-400 font-mono bg-slate-900/60 p-2 rounded-lg border border-slate-800">
          <div v-for="(val, key) in Object.entries(product.specifications).slice(0, 2)" :key="key" class="truncate">
            <span class="text-slate-500">{{ val[0] }}:</span> {{ val[1] }}
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Action -->
    <div class="p-5 pt-0 flex items-center justify-between gap-3 mt-2">
      <div>
        <span class="text-xs text-slate-400 block font-mono">Precio</span>
        <span class="text-xl font-bold font-display text-white">${{ product.price.toFixed(2) }}</span>
      </div>

      <button
        @click="handleAddToCart"
        :disabled="product.stock <= 0"
        class="px-4 py-2.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all shadow-lg"
        :class="added
          ? 'bg-emerald-500 text-dark-900 font-bold'
          : product.stock > 0
            ? 'bg-brand-500 hover:bg-brand-400 text-dark-900 glow-btn font-semibold'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'"
      >
        <svg v-if="!added" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span>{{ added ? '¡Añadido!' : (product.stock > 0 ? 'Agregar' : 'Sin Stock') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from '~/stores/cart';

const props = defineProps<{
  product: any;
}>();

const cartStore = useCartStore();
const added = ref(false);

const handleAddToCart = () => {
  if (props.product.stock > 0) {
    cartStore.addItem(props.product, 1);
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
