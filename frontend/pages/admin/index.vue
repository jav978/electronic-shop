<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold font-display text-white">Dashboard de Administración</h1>
        <p class="text-xs text-slate-400 font-mono mt-1">Métricas de rendimiento de ventas e inventario en tiempo real</p>
      </div>

      <NuxtLink to="/admin/reports" class="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-950 flex items-center gap-2">
        <span>📄 Reporte Sales PDF</span>
      </NuxtLink>
    </div>

    <!-- KPIs Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="glass-panel p-6 rounded-2xl border-l-4 border-l-emerald-500">
        <span class="text-xs font-mono text-slate-400 uppercase">Ingresos Totales</span>
        <div class="text-3xl font-bold font-display text-white mt-2">${{ analytics?.metrics?.totalRevenue?.toFixed(2) || '0.00' }}</div>
        <span class="text-[11px] text-emerald-400 mt-1 block">✓ Pedidos aprobados</span>
      </div>

      <div class="glass-panel p-6 rounded-2xl border-l-4 border-l-brand-500">
        <span class="text-xs font-mono text-slate-400 uppercase">Total Pedidos</span>
        <div class="text-3xl font-bold font-display text-white mt-2">{{ analytics?.metrics?.totalOrders || 0 }}</div>
        <span class="text-[11px] text-brand-400 mt-1 block">{{ analytics?.metrics?.paidOrdersCount || 0 }} Procesados</span>
      </div>

      <div class="glass-panel p-6 rounded-2xl border-l-4 border-l-indigo-500">
        <span class="text-xs font-mono text-slate-400 uppercase">Catálogo Activo</span>
        <div class="text-3xl font-bold font-display text-white mt-2">{{ analytics?.metrics?.totalProducts || 0 }}</div>
        <span class="text-[11px] text-indigo-400 mt-1 block">Productos en sistema</span>
      </div>

      <div class="glass-panel p-6 rounded-2xl border-l-4 border-l-red-500">
        <span class="text-xs font-mono text-slate-400 uppercase">Alertas Bajo Stock</span>
        <div class="text-3xl font-bold font-display text-white mt-2 text-red-400">{{ analytics?.metrics?.lowStockCount || 0 }}</div>
        <span class="text-[11px] text-red-400 mt-1 block">≤ 10 Unidades restantes</span>
      </div>
    </div>

    <!-- Sales Chart & Low Stock Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Sales Chart -->
      <div class="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 class="text-lg font-bold font-display text-white flex items-center justify-between">
          <span>📈 Tendencia de Ventas</span>
          <span class="text-xs font-mono text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-lg">Caché Servidor: Hit</span>
        </h3>
        <SalesChart :labels="chartLabels" :data="chartData" title="Ventas ($ USD)" />
      </div>

      <!-- Low Stock Alerts -->
      <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 class="text-lg font-bold font-display text-white text-red-400 flex items-center gap-2">
          <span>⚠️ Inventario Crítico</span>
        </h3>

        <div class="space-y-3 max-h-64 overflow-y-auto pr-1">
          <div
            v-for="prod in analytics?.lowStockProducts"
            :key="prod.id"
            class="p-3 rounded-xl bg-red-950/20 border border-red-500/30 flex items-center justify-between text-xs"
          >
            <div>
              <span class="font-bold text-white block truncate max-w-[150px]">{{ prod.name }}</span>
              <span class="text-slate-400 font-mono">SKU: {{ prod.sku }}</span>
            </div>
            <span class="px-2 py-1 rounded-md bg-red-500/30 text-red-300 font-bold font-mono">
              {{ prod.stock }} uds.
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders Table -->
    <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <h3 class="text-lg font-bold font-display text-white">Últimos Pedidos Recibidos</h3>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs font-mono text-slate-300">
          <thead class="bg-slate-900 text-slate-400 uppercase">
            <tr>
              <th class="p-3">Nº Orden</th>
              <th class="p-3">Cliente</th>
              <th class="p-3">Estado</th>
              <th class="p-3">Fecha</th>
              <th class="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr v-for="order in analytics?.recentOrders" :key="order.id" class="hover:bg-slate-900/50">
              <td class="p-3 font-bold text-brand-400">{{ order.orderNumber }}</td>
              <td class="p-3 text-white">{{ order.user?.name || 'Cliente' }}</td>
              <td class="p-3">
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-brand-500/20 text-brand-300">
                  {{ order.status }}
                </span>
              </td>
              <td class="p-3">{{ new Date(order.createdAt).toLocaleDateString('es-ES') }}</td>
              <td class="p-3 text-right font-bold text-white">${{ order.totalAmount.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import SalesChart from '~/components/SalesChart.vue';

definePageMeta({
  layout: 'admin'
});

const authStore = useAuthStore();
const analytics = ref<any>(null);
const chartLabels = ref(['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']);
const chartData = ref([45, 120, 78, 160, 210, 89, 202.78]);

onMounted(async () => {
  const config = useRuntimeConfig();
  try {
    const data = await $fetch<any>(`${config.public.apiBase}/reports/analytics`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    analytics.value = data;
    if (data.recentOrders?.length > 0) {
      chartLabels.value = data.recentOrders.slice(0, 7).reverse().map((o: any) => new Date(o.createdAt).toLocaleDateString('es-ES', { weekday: 'short' }));
      chartData.value = data.recentOrders.slice(0, 7).reverse().map((o: any) => o.totalAmount);
    }
  } catch (err) {
    console.error('Error fetching admin analytics:', err);
  }
});
</script>
