<template>
  <div class="space-y-8">
    <!-- Header with PDF Export Action -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold font-display text-slate-900 dark:text-white">Reportes de Ventas & Exportación PDF</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">Genera reportes corporativos oficiales y analiza el rendimiento comercial</p>
      </div>

      <button
        @click="downloadPDF"
        :disabled="downloading"
        class="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-bold text-sm glow-btn flex items-center gap-2 shadow-xl shadow-emerald-950/20 transition-all disabled:opacity-50"
      >
        <span v-if="downloading" class="w-4 h-4 rounded-full border-2 border-dark-900 border-t-transparent animate-spin"></span>
        <span>{{ downloading ? 'Generando PDF...' : '📄 Descargar Reporte PDF' }}</span>
      </button>
    </div>

    <!-- Analytics Breakdown -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
        <span class="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase">Ingresos por Ventas</span>
        <div class="text-3xl font-bold font-display text-emerald-600 dark:text-emerald-400 mt-2">
          ${{ analytics?.metrics?.totalRevenue?.toFixed(2) || '0.00' }}
        </div>
        <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Total acumulado de órdenes pagadas</p>
      </div>

      <div class="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
        <span class="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase">Promedio por Pedido</span>
        <div class="text-3xl font-bold font-display text-slate-900 dark:text-white mt-2">
          ${{ averageTicket.toFixed(2) }}
        </div>
        <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Valor promedio de compra por cliente</p>
      </div>

      <div class="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
        <span class="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase">Tasa de Conversión Stock</span>
        <div class="text-3xl font-bold font-display text-purple-600 dark:text-purple-400 mt-2">
          {{ stockConversionRate }}%
        </div>
        <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Productos con rotación activa</p>
      </div>
    </div>

    <!-- Chart -->
    <div class="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
      <h3 class="text-lg font-bold font-display text-slate-900 dark:text-white">Análisis de Tendencia de Ingresos</h3>
      <SalesChart :labels="chartLabels" :data="chartData" title="Ingresos ($ USD)" />
    </div>

    <!-- Top Products Table -->
    <div class="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
      <h3 class="text-lg font-bold font-display text-slate-900 dark:text-white">Top 5 Productos Más Vendidos</h3>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs font-mono text-slate-700 dark:text-slate-300">
          <thead class="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th class="p-3">Producto</th>
              <th class="p-3">Categoría</th>
              <th class="p-3 text-center">Unidades Vendidas</th>
              <th class="p-3 text-right">Ingresos Generados</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
            <tr v-for="prod in analytics?.topProducts" :key="prod.id" class="hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors">
              <td class="p-3 font-bold text-slate-900 dark:text-white font-sans text-sm">{{ prod.name }}</td>
              <td class="p-3 text-slate-600 dark:text-slate-400">{{ prod.category }}</td>
              <td class="p-3 text-center font-bold text-brand-600 dark:text-brand-400">{{ prod.totalQuantity }} uds.</td>
              <td class="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">${{ prod.totalRevenue.toFixed(2) }}</td>
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
import { useToast } from '~/composables/useToast';
import SalesChart from '~/components/SalesChart.vue';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
});

const authStore = useAuthStore();
const toast = useToast();
const analytics = ref<any>(null);
const downloading = ref(false);

const chartLabels = ref(['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul']);
const chartData = ref([150, 230, 180, 420, 310, 520, 680.50]);

onMounted(async () => {
  const config = useRuntimeConfig();
  try {
    const data = await $fetch<any>(`${config.public.apiBase}/reports/analytics`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    analytics.value = data;
    if (data.recentOrders?.length > 0) {
      chartLabels.value = data.recentOrders.slice(0, 7).reverse().map((o: any) => new Date(o.createdAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }));
      chartData.value = data.recentOrders.slice(0, 7).reverse().map((o: any) => o.totalAmount);
    }
  } catch (err: any) {
    console.error('Error fetching reports analytics:', err);
    toast.error('Error', err.data?.error || 'No se pudieron cargar los reportes de ventas.');
  }
});

const averageTicket = computed(() => {
  if (!analytics.value?.metrics?.paidOrdersCount) return 0;
  return analytics.value.metrics.totalRevenue / analytics.value.metrics.paidOrdersCount;
});

const stockConversionRate = computed(() => {
  if (!analytics.value?.metrics?.totalProducts) return 0;
  const inStockCount = analytics.value.metrics.totalProducts - analytics.value.metrics.lowStockCount;
  return Math.round((inStockCount / analytics.value.metrics.totalProducts) * 100);
});

const downloadPDF = async () => {
  downloading.value = true;
  const config = useRuntimeConfig();
  try {
    const response = await fetch(`${config.public.apiBase}/reports/pdf`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });

    if (!response.ok) throw new Error('Error en la descarga del PDF.');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Reporte_Ventas_ElectroTech.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    toast.success('Descarga Exitosa', 'El reporte PDF fue generado y descargado.');
  } catch (err: any) {
    toast.error('Error de Descarga', err.message || 'Error al generar el reporte PDF.');
  } finally {
    downloading.value = false;
  }
};
</script>
