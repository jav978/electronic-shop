<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Success Banner after checkout -->
    <div v-if="orderSuccess" class="glass-panel p-6 rounded-2xl border-emerald-300 dark:border-emerald-500/40 bg-emerald-100 dark:bg-emerald-500/10 mb-8 flex items-center gap-4 animate-bounce">
      <div class="w-10 h-10 rounded-xl bg-emerald-500 text-dark-900 font-bold flex items-center justify-center text-xl">
        ✓
      </div>
      <div>
        <h3 class="font-bold text-emerald-800 dark:text-emerald-300 text-base">¡Pedido Procesado Exitosamente!</h3>
        <p class="text-xs text-slate-600 dark:text-slate-300">Hemos recibido tu compra y estamos preparando los componentes para su envío.</p>
      </div>
    </div>

    <!-- Header & Profile Card -->
    <div class="glass-panel p-8 rounded-3xl mb-10 flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-200 dark:border-slate-800">
      <div class="flex items-center gap-5">
        <div class="w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/40 text-brand-600 dark:text-brand-300 font-bold text-2xl flex items-center justify-center">
          {{ authStore.user?.name?.charAt(0).toUpperCase() || 'U' }}
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-bold font-display text-slate-900 dark:text-white">{{ authStore.user?.name }}</h1>
            <span
              class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              :class="authStore.isAdmin ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/40' : 'bg-brand-500/20 text-brand-700 dark:text-brand-300 border border-brand-500/40'"
            >
              {{ authStore.user?.role }}
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{{ authStore.user?.email }}</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink v-if="authStore.isAdmin" to="/admin" class="px-4 py-2 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/40 hover:bg-purple-200 dark:hover:bg-purple-900 text-xs font-bold">
          ⚡ Ir al Panel Admin
        </NuxtLink>
        <button @click="logout" class="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium border border-slate-300 dark:border-slate-700">
          Cerrar Sesión
        </button>
      </div>
    </div>

    <!-- Order History Section -->
    <div>
      <h2 class="text-2xl font-bold font-display text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <span>📦 Mis Pedidos</span>
        <span class="text-xs font-mono text-slate-500 dark:text-slate-400">({{ orders.length }} registrados)</span>
      </h2>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <div v-for="n in 3" :key="n" class="glass-panel h-24 rounded-2xl animate-pulse"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="glass-panel p-12 rounded-3xl text-center border border-slate-200 dark:border-slate-800">
        <div class="text-4xl mb-3">📦</div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Aún no has realizado pedidos</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-6">Explora nuestro catálogo y realiza tu primera compra de microcontroladores.</p>
        <NuxtLink to="/products" class="px-6 py-2.5 rounded-xl bg-brand-500 text-dark-900 font-bold text-xs">
          Ver Productos
        </NuxtLink>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-4">
        <div
          v-for="order in orders"
          :key="order.id"
          class="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div>
            <div class="flex items-center gap-3 mb-1">
              <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-base">{{ order.orderNumber }}</span>
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase"
                :class="getStatusBadgeClass(order.status)"
              >
                {{ order.status }}
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Fecha: {{ new Date(order.createdAt).toLocaleDateString('es-ES') }} | Dirección: {{ order.shippingAddress }}
            </p>
          </div>

          <div class="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-3 md:pt-0 border-t md:border-0 border-slate-200 dark:border-slate-800">
            <div class="text-right">
              <span class="text-xs text-slate-500 dark:text-slate-400 block font-mono">Total</span>
              <span class="text-lg font-bold font-display text-slate-900 dark:text-white">${{ order.totalAmount.toFixed(2) }}</span>
            </div>

            <button
              @click="selectedOrder = order"
              class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700"
            >
              Ver Detalle →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <div v-if="selectedOrder" class="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="glass-panel max-w-2xl w-full p-8 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span class="text-xs font-mono text-brand-600 dark:text-brand-400 uppercase font-semibold">Detalle del Pedido</span>
            <h3 class="text-xl font-bold font-display text-slate-900 dark:text-white">{{ selectedOrder.orderNumber }}</h3>
          </div>
          <button @click="selectedOrder = null" class="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-xl">✕</button>
        </div>

        <div class="space-y-4">
          <div class="bg-slate-100 dark:bg-slate-900 p-4 rounded-xl text-xs space-y-1 font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
            <div><strong>Estado:</strong> {{ selectedOrder.status }}</div>
            <div><strong>Método de Pago:</strong> {{ selectedOrder.paymentMethod }}</div>
            <div><strong>Dirección:</strong> {{ selectedOrder.shippingAddress }}</div>
          </div>

          <h4 class="font-bold text-slate-900 dark:text-white text-sm">Artículos Comprados:</h4>
          <div class="space-y-2">
            <div v-for="item in selectedOrder.items" :key="item.id" class="flex justify-between items-center text-xs p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div>
                <span class="font-bold text-slate-900 dark:text-white block">{{ item.product.name }}</span>
                <span class="text-slate-500 dark:text-slate-400 font-mono">{{ item.quantity }} unidades x ${{ item.unitPrice.toFixed(2) }}</span>
              </div>
              <span class="font-bold font-mono text-brand-600 dark:text-brand-300">${{ item.totalPrice.toFixed(2) }}</span>
            </div>
          </div>

          <div class="flex justify-between items-baseline pt-4 border-t border-slate-200 dark:border-slate-800">
            <span class="font-bold text-slate-900 dark:text-white text-sm">Monto Total:</span>
            <span class="text-2xl font-bold font-display text-brand-600 dark:text-brand-400">${{ selectedOrder.totalAmount.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter, useRoute } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const orders = ref<any[]>([]);
const loading = ref(true);
const selectedOrder = ref<any | null>(null);
const orderSuccess = ref(route.query.orderSuccess === 'true');

onMounted(async () => {
  authStore.initAuth();
  if (!authStore.isLoggedIn) {
    router.push('/login');
    return;
  }

  const config = useRuntimeConfig();
  try {
    const data = await $fetch<any[]>(`${config.public.apiBase}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    orders.value = data;
  } catch (err) {
    console.error('Error loading orders:', err);
  } finally {
    loading.value = false;
  }
});

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'PAID': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
    case 'SHIPPED': return 'bg-brand-500/20 text-brand-300 border border-brand-500/40';
    case 'DELIVERED': return 'bg-blue-500/20 text-blue-300 border border-blue-500/40';
    case 'CANCELLED': return 'bg-red-500/20 text-red-300 border border-red-500/40';
    default: return 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
  }
};

const logout = () => {
  authStore.logout();
  router.push('/');
};
</script>
