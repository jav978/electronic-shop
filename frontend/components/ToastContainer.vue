<template>
  <div class="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
    <TransitionGroup name="toast-fade">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="pointer-events-auto p-4 rounded-2xl shadow-xl backdrop-blur-xl border transition-all duration-300 flex items-start gap-3 glass-panel"
        :class="toastClasses(t.type)"
      >
        <!-- Icon -->
        <div class="text-xl shrink-0 mt-0.5">
          <span v-if="t.type === 'success'">✅</span>
          <span v-else-if="t.type === 'error'">❌</span>
          <span v-else-if="t.type === 'warning'">⚠️</span>
          <span v-else>ℹ️</span>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-xs uppercase tracking-wider text-heading">{{ t.title }}</h4>
          <p v-if="t.message" class="text-xs text-muted mt-0.5 leading-relaxed break-words">{{ t.message }}</p>
        </div>

        <!-- Close Button -->
        <button
          @click="remove(t.id)"
          class="text-muted hover:text-heading text-xs font-bold p-1 rounded-lg transition-colors"
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
      return 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300 html-light:bg-emerald-50 html-light:border-emerald-200 html-light:text-emerald-800';
    case 'error':
      return 'border-rose-500/30 bg-rose-950/40 text-rose-300 html-light:bg-rose-50 html-light:border-rose-200 html-light:text-rose-800';
    case 'warning':
      return 'border-amber-500/30 bg-amber-950/40 text-amber-300 html-light:bg-amber-50 html-light:border-amber-200 html-light:text-amber-800';
    case 'info':
    default:
      return 'border-cyan-500/30 bg-cyan-950/40 text-cyan-300 html-light:bg-cyan-50 html-light:border-cyan-200 html-light:text-cyan-800';
  }
};
</script>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.35s ease;
}
.toast-fade-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}
</style>
