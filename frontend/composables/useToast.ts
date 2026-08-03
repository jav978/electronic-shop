import { ref } from 'vue';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

const toasts = ref<ToastItem[]>([]);

export function useToast() {
  const add = (type: ToastType, title: string, message?: string, duration: number = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: ToastItem = { id, type, title, message, duration };
    toasts.value.push(toast);

    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }
  };

  const remove = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  };

  const success = (title: string, message?: string) => add('success', title, message);
  const error = (title: string, message?: string) => add('error', title, message);
  const warning = (title: string, message?: string) => add('warning', title, message);
  const info = (title: string, message?: string) => add('info', title, message);

  return {
    toasts,
    add,
    remove,
    success,
    error,
    warning,
    info
  };
}
