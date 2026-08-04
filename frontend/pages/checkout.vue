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
          <h3 class="text-lg font-bold font-display text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
            <span>📍</span> Dirección de Envío
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

        <!-- Payment Method Selector & Interactive Sandbox Widgets -->
        <div class="glass-panel p-6 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 class="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <span>💳</span> Pasarela de Pago
            </h3>
            <span class="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> 🧪 Sandbox Active
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label
              class="p-4 rounded-xl border cursor-pointer flex flex-col items-center justify-center gap-2 transition-all text-center"
              :class="paymentMethod === 'STRIPE' ? 'bg-brand-500/20 border-brand-500 text-slate-900 dark:text-white font-bold' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'"
            >
              <input type="radio" v-model="paymentMethod" value="STRIPE" class="sr-only" />
              <span class="text-xl">💳</span>
              <span class="text-xs font-bold">Stripe Checkout</span>
            </label>

            <label
              class="p-4 rounded-xl border cursor-pointer flex flex-col items-center justify-center gap-2 transition-all text-center"
              :class="paymentMethod === 'PAYPAL' ? 'bg-blue-500/20 border-blue-500 text-slate-900 dark:text-white font-bold' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'"
            >
              <input type="radio" v-model="paymentMethod" value="PAYPAL" class="sr-only" />
              <span class="text-xl">🅿️</span>
              <span class="text-xs font-bold">PayPal Smart Buttons</span>
            </label>

            <label
              class="p-4 rounded-xl border cursor-pointer flex flex-col items-center justify-center gap-2 transition-all text-center"
              :class="paymentMethod === 'TRANSFER' ? 'bg-purple-500/20 border-purple-500 text-slate-900 dark:text-white font-bold' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'"
            >
              <input type="radio" v-model="paymentMethod" value="TRANSFER" class="sr-only" />
              <span class="text-xl">🏦</span>
              <span class="text-xs font-bold">Transferencia</span>
            </label>
          </div>

          <!-- STRIPE ELEMENTS SANDBOX CONTAINER -->
          <div v-if="paymentMethod === 'STRIPE'" class="p-4 rounded-xl bg-slate-900 text-white border border-slate-700/80 space-y-3 mt-4">
            <div class="flex items-center justify-between text-xs font-mono">
              <span class="text-brand-400 font-bold flex items-center gap-1">🔒 Stripe Elements (Test Mode)</span>
              <button type="button" @click="autoFillStripeCard" class="text-brand-400 underline hover:text-brand-300">
                ⚡ Autocompletar Tarjeta
              </button>
            </div>

            <div>
              <label class="block text-[11px] text-slate-400 mb-1">Número de Tarjeta de Prueba</label>
              <input
                v-model="stripeCardNumber"
                type="text"
                placeholder="4242 4242 4242 4242"
                class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-brand-400"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] text-slate-400 mb-1">Expiración (MM/AA)</label>
                <input
                  v-model="stripeExp"
                  type="text"
                  placeholder="12 / 28"
                  class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-brand-400"
                />
              </div>
              <div>
                <label class="block text-[11px] text-slate-400 mb-1">CVC / CVC2</label>
                <input
                  v-model="stripeCvc"
                  type="text"
                  placeholder="123"
                  class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-brand-400"
                />
              </div>
            </div>

            <p class="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>🛡️</span> Cifrado de extremo a extremo de 256 bits simulado via Stripe API.
            </p>
          </div>

          <!-- PAYPAL SMART BUTTONS SANDBOX CONTAINER -->
          <div v-if="paymentMethod === 'PAYPAL'" class="p-4 rounded-xl bg-blue-950/60 border border-blue-800 space-y-3 mt-4 text-white">
            <div class="flex items-center justify-between text-xs font-mono">
              <span class="text-blue-400 font-bold flex items-center gap-1">🅿️ PayPal Sandbox SDK</span>
              <span class="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/40">TEST MODE</span>
            </div>

            <div class="p-3 bg-slate-900/90 rounded-lg text-xs font-mono text-slate-300 space-y-1">
              <div><strong>Cuenta Sandbox:</strong> sb-buyer-electrotech@business.example.com</div>
              <div><strong>Estado:</strong> Conexión con PayPal SDK activa</div>
            </div>

            <button
              type="button"
              @click="handlePayPalSandboxSubmit"
              :disabled="loading"
              class="w-full py-3 rounded-xl font-bold text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span class="font-bold font-sans italic text-blue-900 text-base">PayPal</span>
              <span>Pagar con PayPal (Sandbox) ⚡</span>
            </button>
          </div>

          <!-- BANK TRANSFER CONTAINER -->
          <div v-if="paymentMethod === 'TRANSFER'" class="p-4 rounded-xl bg-purple-950/40 border border-purple-800 text-xs text-purple-200 space-y-2">
            <p class="font-bold text-purple-300">🏦 Datos de Transferencia Bancaria Directa:</p>
            <p><strong>Banco:</strong> Banco de Chile / Estado</p>
            <p><strong>Cuenta Corriente:</strong> 00-1234567-89</p>
            <p><strong>RUT / Tax ID:</strong> 76.543.210-K</p>
            <p><strong>Titular:</strong> ElectroTech Studio SpA</p>
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
            <span>{{ loading ? 'Procesando Pago Sandbox...' : 'Confirmar & Pagar ⚡' }}</span>
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
import { useToast } from '~/composables/useToast';
import { useRouter } from 'vue-router';

definePageMeta({
  middleware: ['auth']
});

const authStore = useAuthStore();
const cartStore = useCartStore();
const toast = useToast();
const router = useRouter();

const fullName = ref('');
const streetAddress = ref('');
const city = ref('');
const phone = ref('');
const paymentMethod = ref('STRIPE');
const stripeCardNumber = ref('4242 4242 4242 4242');
const stripeExp = ref('12 / 28');
const stripeCvc = ref('123');
const loading = ref(false);
const error = ref<string | null>(null);

onMounted(() => {
  authStore.initAuth();
  cartStore.initCart();
  if (authStore.user) {
    fullName.value = authStore.user.name;
  }
});

const autoFillStripeCard = () => {
  stripeCardNumber.value = '4242 4242 4242 4242';
  stripeExp.value = '12 / 28';
  stripeCvc.value = '123';
  toast.info('Tarjeta de Prueba Autofilled', 'Se ha ingresado la tarjeta de prueba Visa 4242 de Stripe.');
};

const handlePayPalSandboxSubmit = async () => {
  await handlePlaceOrder();
};

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
    const providerName = paymentMethod.value === 'PAYPAL' ? 'PayPal Sandbox' : (paymentMethod.value === 'STRIPE' ? 'Stripe Checkout Sandbox' : 'Transferencia Bancaria');
    toast.success('¡Pago Aprobado (Sandbox)!', `Pedido #${res.orderNumber || ''} procesado mediante ${providerName}.`);
    router.push('/profile?orderSuccess=true');
  } catch (err: any) {
    const errMsg = err.data?.error || 'Error al procesar el pedido. Por favor intenta nuevamente.';
    error.value = errMsg;
    toast.error('Error en la Compra', errMsg);
  } finally {
    loading.value = false;
  }
};
</script>
