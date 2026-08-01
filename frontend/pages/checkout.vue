<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 class="text-3xl font-bold font-display text-slate-900 dark:text-white mb-8">Finalizar Pedido</h1>

    <!-- Auth Alert if Not Logged In -->
    <div v-if="!authStore.isLoggedIn" class="glass-panel p-6 rounded-2xl border-amber-300 dark:border-amber-500/40 bg-amber-100 dark:bg-amber-500/10 mb-8 flex items-center justify-between">
      <div>
        <h4 class="font-bold text-amber-800 dark:text-amber-300 text-sm">Inicia Sesión para Continuar</h4>
        <p class="text-xs text-slate-600 dark:text-slate-300">Necesitas estar registrado para asociar tu dirección y ver el seguimiento en tu perfil.</p>
      </div>
      <NuxtLink to="/login?redirect=/checkout" class="px-4 py-2 rounded-xl bg-amber-500 text-dark-900 font-bold text-xs">
        Iniciar Sesión
      </NuxtLink>
    </div>

    <form @submit.prevent="handlePlaceOrder" class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Shipping & Payment Details -->
      <div class="md:col-span-2 space-y-6">
        <!-- Shipping Address Form -->
        <div class="glass-panel p-6 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800">
          <h3 class="text-lg font-bold font-display text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
            📍 Dirección de Envío
          </h3>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">Nombre Completo del Destinatario</label>
              <input
                v-model="fullName"
                required
                type="text"
                placeholder="Ej: Carlos Ruiz"
                class="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            <div>
              <label class="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">Dirección de Calle y Número</label>
              <input
                v-model="streetAddress"
                required
                type="text"
                placeholder="Ej: Av. Principal 123, Dpto 4B"
                class="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">Ciudad / Región</label>
                <input
                  v-model="city"
                  required
                  type="text"
                  placeholder="Santiago"
                  class="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
              <div>
                <label class="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">Teléfono de Contacto</label>
                <input
                  v-model="phone"
                  required
                  type="text"
                  placeholder="+56 9 1234 5678"
                  class="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Method Selector -->
        <div class="glass-panel p-6 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800">
          <h3 class="text-lg font-bold font-display text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
            💳 Método de Pago
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label
              class="p-4 rounded-xl border cursor-pointer flex flex-col items-center justify-center gap-2 transition-all text-center"
              :class="paymentMethod === 'CREDIT_CARD' ? 'bg-brand-500/20 border-brand-500 text-slate-900 dark:text-white font-bold' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'"
            >
              <input type="radio" v-model="paymentMethod" value="CREDIT_CARD" class="sr-only" />
              <span class="text-xl">💳</span>
              <span class="text-xs font-bold">Tarjeta de Crédito</span>
            </label>

            <label
              class="p-4 rounded-xl border cursor-pointer flex flex-col items-center justify-center gap-2 transition-all text-center"
              :class="paymentMethod === 'PAYPAL' ? 'bg-brand-500/20 border-brand-500 text-slate-900 dark:text-white font-bold' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'"
            >
              <input type="radio" v-model="paymentMethod" value="PAYPAL" class="sr-only" />
              <span class="text-xl">🅿️</span>
              <span class="text-xs font-bold">PayPal</span>
            </label>

            <label
              class="p-4 rounded-xl border cursor-pointer flex flex-col items-center justify-center gap-2 transition-all text-center"
              :class="paymentMethod === 'TRANSFER' ? 'bg-brand-500/20 border-brand-500 text-slate-900 dark:text-white font-bold' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'"
            >
              <input type="radio" v-model="paymentMethod" value="TRANSFER" class="sr-only" />
              <span class="text-xl">🏦</span>
              <span class="text-xs font-bold">Transferencia</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Order Summary Card -->
      <aside>
        <div class="glass-panel p-6 rounded-2xl space-y-4 sticky top-24 border border-slate-200 dark:border-slate-800">
          <h3 class="text-base font-bold font-display text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">Resumen de la Orden</h3>

          <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
            <div v-for="item in cartStore.items" :key="item.product.id" class="flex justify-between items-center text-xs py-1">
              <span class="text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{{ item.quantity }}x {{ item.product.name }}</span>
              <span class="font-mono text-slate-900 dark:text-white font-semibold">${{ (item.product.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>

          <div class="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-2 text-xs font-mono text-slate-600 dark:text-slate-400">
            <div class="flex justify-between">
              <span>Subtotal:</span>
              <span>${{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Impuestos (19%):</span>
              <span>${{ cartStore.tax.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Envío:</span>
              <span class="text-emerald-600 dark:text-emerald-400 font-bold">${{ cartStore.shipping.toFixed(2) }}</span>
            </div>
          </div>

          <div class="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between items-baseline">
            <span class="font-bold text-slate-900 dark:text-white text-sm">Total a Pagar:</span>
            <span class="text-xl font-bold font-display text-brand-600 dark:text-brand-400">${{ cartStore.grandTotal.toFixed(2) }}</span>
          </div>

          <div v-if="error" class="p-3 rounded-xl bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 text-xs text-red-700 dark:text-red-300">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading || cartStore.items.length === 0 || !authStore.isLoggedIn"
            class="w-full py-4 rounded-xl font-bold text-sm bg-brand-500 hover:bg-brand-400 text-dark-900 glow-btn flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span v-if="loading" class="w-4 h-4 rounded-full border-2 border-dark-900 border-t-transparent animate-spin"></span>
            <span>{{ loading ? 'Procesando Pago...' : 'Confirmar & Pagar ⚡' }}</span>
          </button>
        </div>
      </aside>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useCartStore } from '~/stores/cart';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();

const fullName = ref('');
const streetAddress = ref('');
const city = ref('');
const phone = ref('');
const paymentMethod = ref('CREDIT_CARD');
const loading = ref(false);
const error = ref<string | null>(null);

onMounted(() => {
  authStore.initAuth();
  cartStore.initCart();
  if (authStore.user) {
    fullName.value = authStore.user.name;
  }
});

const handlePlaceOrder = async () => {
  if (!authStore.isLoggedIn) {
    router.push('/login?redirect=/checkout');
    return;
  }

  loading.value = true;
  error.value = null;

  const config = useRuntimeConfig();

  try {
    const shippingAddress = `${fullName.value}, ${streetAddress.value}, ${city.value} (Tel: ${phone.value})`;
    const payload = {
      items: cartStore.items.map(i => ({
        productId: i.product.id,
        quantity: i.quantity
      })),
      shippingAddress,
      paymentMethod: paymentMethod.value
    };

    const res = await $fetch<any>(`${config.public.apiBase}/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      },
      body: payload
    });

    cartStore.clearCart();
    router.push('/profile?orderSuccess=true');
  } catch (err: any) {
    error.value = err.data?.error || 'Error al procesar el pedido. Por favor intenta nuevamente.';
  } finally {
    loading.value = false;
  }
};
</script>
