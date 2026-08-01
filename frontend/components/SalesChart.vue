<template>
  <div class="w-full h-64 relative">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps<{
  labels: string[];
  data: number[];
  title?: string;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const renderChart = () => {
  if (!canvasRef.value) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = canvasRef.value.getContext('2d');
  if (!ctx) return;

  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
  gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: [
        {
          label: props.title || 'Ventas ($ USD)',
          data: props.data,
          borderColor: '#06b6d4',
          borderWidth: 3,
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#06b6d4',
          pointBorderColor: '#ffffff',
          pointRadius: 5,
          pointHoverRadius: 7
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#94a3b8',
            font: { family: 'Inter', size: 12 }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8', font: { family: 'Inter' } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8', font: { family: 'Inter' } }
        }
      }
    }
  });
};

onMounted(() => {
  renderChart();
});

watch(() => props.data, () => {
  renderChart();
}, { deep: true });
</script>
