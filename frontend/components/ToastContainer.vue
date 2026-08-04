<template>
  <div class="fixed top-20 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
    <TransitionGroup name="toast-fade">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="pointer-events-auto p-4 rounded-2xl shadow-2xl backdrop-blur-2xl border transition-all duration-300 flex items-start gap-3.5"
        :class="toastClasses(t.type)"
      >
        <!-- Icon -->
        <div class="text-xl shrink-0 mt-0.5 select-none">
          <span v-if="t.type === 'success'">✅</span>
          <span v-else-if="t.type === 'error'">❌</span>
          <span v-else-if="t.type === 'warning'">⚠️</span>
          <span v-else>ℹ️</span>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">{{ t.title }}</h4>
          <p v-if="t.message" class="text-xs text-slate-700 dark:text-slate-200 mt-1 leading-relaxed break-words font-medium">{{ t.message }}</p>
        </div>

        <!-- Close Button -->
        <button
          @click="remove(t.id)"
          class="text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold p-1 rounded-lg transition-colors select-none"
          title="Cerrar"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast';

const { toasts, remove } = useToast();

const toastClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-300 dark:border-emerald-500/50 text-emerald-900 dark:text-emerald-200 shadow-emerald-500/10';
    case 'error':
      return 'bg-rose-50 dark:bg-rose-950/90 border-rose-300 dark:border-rose-500/50 text-rose-900 dark:text-rose-200 shadow-rose-500/10';
    case 'warning':
      return 'bg-amber-50 dark:bg-amber-950/90 border-amber-300 dark:border-amber-500/50 text-amber-900 dark:text-amber-200 shadow-amber-500/10';
    case 'info':
    default:
      return 'bg-cyan-50 dark:bg-cyan-950/90 border-cyan-300 dark:border-cyan-500/50 text-cyan-900 dark:text-cyan-200 shadow-cyan-500/10';
  }
};
</script>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-fade-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}
</style>
