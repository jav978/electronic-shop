<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold font-display text-white">Gestión de Pedidos</h1>
        <p class="text-xs text-slate-400 font-mono mt-1">Supervisa y actualiza el estado de entrega de las compras</p>
      </div>

      <div class="flex gap-2">
        <button
          v-for="st in ['TODOS', 'PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']"
          :key="st"
          @click="statusFilter = st"
          class="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all"
          :class="statusFilter === st ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'"
        >
          {{ st }}
        </button>
      </div>
    </div>

    <!-- Orders Table Card -->
    <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs font-mono text-slate-300">
          <thead class="bg-slate-900 text-slate-400 uppercase border-b border-slate-800">
            <tr>
              <th class="p-3">Nº Orden</th>
              <th class="p-3">Cliente</th>
              <th class="p-3">Dirección de Envío</th>
              <th class="p-3">Artículos</th>
              <th class="p-3">Total</th>
              <th class="p-3">Estado Actual</th>
              <th class="p-3 text-center">Cambiar Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-slate-900/50">
              <td class="p-3 font-bold text-purple-400">{{ order.orderNumber }}</td>
              <td class="p-3">
                <span class="font-bold text-white block">{{ order.user?.name }}</span>
                <span class="text-slate-500 text-[10px]">{{ order.user?.email }}</span>
              </td>
              <td class="p-3 text-slate-400 max-w-xs truncate">{{ order.shippingAddress }}</td>
              <td class="p-3 font-bold">{{ order.items?.length || 0 }} productos</td>
              <td class="p-3 font-bold text-white">${{ order.totalAmount.toFixed(2) }}</td>
              <td class="p-3">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase" :class="getStatusBadgeClass(order.status)">
                  {{ order.status }}
                </span>
              </td>
              <td class="p-3 text-center">
                <select
                  :value="order.status"
                  @change="updateStatus(order.id, ($event.target as HTMLSelectElement).value)"
                  class="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-purple-500"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  layout: 'admin'
});

const authStore = useAuthStore();
const orders = ref<any[]>([]);
const statusFilter = ref('TODOS');

const fetchOrders = async () => {
  const config = useRuntimeConfig();
  try {
    const data = await $fetch<any[]>(`${config.public.apiBase}/orders`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    orders.value = data;
  } catch (err) {
    console.error('Error fetching admin orders:', err);
  }
};

onMounted(() => {
  fetchOrders();
});

const filteredOrders = computed(() => {
  if (statusFilter.value === 'TODOS') return orders.value;
  return orders.value.filter(o => o.status === statusFilter.value);
});

const updateStatus = async (orderId: string, newStatus: string) => {
  const config = useRuntimeConfig();
  try {
    await $fetch(`${config.public.apiBase}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: { status: newStatus }
    });
    fetchOrders();
  } catch (err) {
    alert('Error al actualizar el estado del pedido.');
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'PAID': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
    case 'SHIPPED': return 'bg-brand-500/20 text-brand-300 border border-brand-500/40';
    case 'DELIVERED': return 'bg-blue-500/20 text-blue-300 border border-blue-500/40';
    case 'CANCELLED': return 'bg-red-500/20 text-red-300 border border-red-500/40';
    default: return 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
  }
};
</script>
