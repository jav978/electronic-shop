<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 class="text-3xl font-bold font-display text-white mb-8 flex items-center gap-3">
      <span>🛒 Carrito de Compras</span>
      <span class="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-brand-400 border border-slate-700">
        {{ cartStore.totalItems }} artículos
      </span>
    </h1>

    <!-- Empty Cart State -->
    <div v-if="cartStore.items.length === 0" class="glass-panel rounded-3xl p-16 text-center max-w-xl mx-auto">
      <div class="text-5xl mb-4">🔌</div>
      <h2 class="text-2xl font-bold text-white mb-2">Tu carrito está vacío</h2>
      <p class="text-slate-400 text-sm mb-8">Añade microcontroladores, placas base o sensores para comenzar tu pedido.</p>
      <NuxtLink to="/products" class="px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-dark-900 font-bold text-sm glow-btn">
        Ver Catálogo de Productos
      </NuxtLink>
    </div>

    <!-- Cart Items & Summary Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Items List -->
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in cartStore.items"
          :key="item.product.id"
          class="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800"
        >
          <div class="flex items-center gap-4 w-full sm:w-auto">
            <img :src="item.product.image" :alt="item.product.name" class="w-16 h-16 object-contain rounded-xl bg-slate-950 p-2 border border-slate-800" />
            <div>
              <NuxtLink :to="`/products/${item.product.slug || item.product.id}`" class="font-bold text-white text-sm hover:text-brand-300 transition-colors">
                {{ item.product.name }}
              </NuxtLink>
              <span class="block text-xs font-mono text-slate-400 mt-1">SKU: {{ item.product.sku }} | ${{ item.product.price.toFixed(2) }} c/u</span>
            </div>
          </div>

          <div class="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-800">
            <!-- Quantity Control -->
            <div class="flex items-center bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
              <button
                @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)"
                class="px-2.5 py-1 text-slate-300 hover:text-white hover:bg-slate-800 text-xs"
              >
                -
              </button>
              <span class="px-3 py-1 text-xs font-bold font-mono text-white">{{ item.quantity }}</span>
              <button
                @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)"
                class="px-2.5 py-1 text-slate-300 hover:text-white hover:bg-slate-800 text-xs"
              >
                +
              </button>
            </div>

            <!-- Line Total -->
            <div class="text-right min-w-[80px]">
              <span class="text-base font-bold font-display text-white">
                ${{ (item.product.price * item.quantity).toFixed(2) }}
              </span>
            </div>

            <!-- Remove Button -->
            <button
              @click="cartStore.removeItem(item.product.id)"
              class="p-2 text-slate-500 hover:text-red-400 transition-colors"
              title="Eliminar"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div class="flex justify-between items-center pt-2">
          <button @click="cartStore.clearCart" class="text-xs text-slate-400 hover:text-red-400 font-medium">
            Vaciar Carrito
          </button>
          <NuxtLink to="/products" class="text-xs text-brand-400 hover:text-brand-300 font-medium">
            ← Continuar Comprando
          </NuxtLink>
        </div>
      </div>

      <!-- Order Summary Card -->
      <aside>
        <div class="glass-panel p-6 rounded-2xl space-y-4 border border-slate-800">
          <h3 class="text-lg font-bold font-display text-white border-b border-slate-800 pb-3">Resumen de Compra</h3>

          <div class="space-y-2.5 text-xs text-slate-300 font-mono">
            <div class="flex justify-between">
              <span>Subtotal:</span>
              <span>${{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Impuestos (19%):</span>
              <span>${{ cartStore.tax.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Envío Express:</span>
              <span v-if="cartStore.shipping === 0" class="text-emerald-400 font-bold">GRATIS</span>
              <span v-else>${{ cartStore.shipping.toFixed(2) }}</span>
            </div>
          </div>

          <div class="border-t border-slate-800 pt-4 flex justify-between items-baseline">
            <span class="font-bold text-white text-base">Total Final:</span>
            <span class="text-2xl font-bold font-display text-brand-400">${{ cartStore.grandTotal.toFixed(2) }}</span>
          </div>

          <p v-if="cartStore.subtotal < 100" class="text-[11px] text-amber-300/80 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/30">
            💡 Agrega <strong>${{ (100 - cartStore.subtotal).toFixed(2) }}</strong> más para obtener <strong>Envío Gratis</strong>.
          </p>

          <NuxtLink to="/checkout" class="w-full py-4 rounded-xl font-bold text-sm bg-brand-500 hover:bg-brand-400 text-dark-900 glow-btn flex items-center justify-center gap-2">
            Procesar Pedido 🚀
          </NuxtLink>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();

onMounted(() => {
  cartStore.initCart();
});
</script>
