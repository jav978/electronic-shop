<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold font-display text-white">Gestión de Inventario & Productos</h1>
        <p class="text-xs text-slate-400 font-mono mt-1">Crea nuevos componentes, actualiza precios y controla el stock</p>
      </div>

      <button @click="openCreateModal" class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-950 flex items-center gap-2">
        <span>+ Nuevo Producto</span>
      </button>
    </div>

    <!-- Product Table Card -->
    <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs font-mono text-slate-300">
          <thead class="bg-slate-900 text-slate-400 uppercase border-b border-slate-800">
            <tr>
              <th class="p-3">Imagen</th>
              <th class="p-3">Producto / SKU</th>
              <th class="p-3">Categoría</th>
              <th class="p-3">Precio ($)</th>
              <th class="p-3">Stock Disponible</th>
              <th class="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr v-for="prod in productStore.products" :key="prod.id" class="hover:bg-slate-900/50">
              <td class="p-3">
                <img :src="prod.image" :alt="prod.name" class="w-10 h-10 object-contain rounded-lg bg-slate-950 p-1 border border-slate-800" />
              </td>
              <td class="p-3">
                <span class="font-bold text-white block font-sans text-sm">{{ prod.name }}</span>
                <span class="text-slate-500 text-[10px]">SKU: {{ prod.sku }}</span>
              </td>
              <td class="p-3">
                <span class="px-2.5 py-0.5 rounded-full bg-slate-800 text-purple-300 text-[10px]">
                  {{ prod.category?.name || 'Electrónica' }}
                </span>
              </td>
              <td class="p-3 font-bold text-white">${{ prod.price.toFixed(2) }}</td>
              <td class="p-3">
                <div class="flex items-center gap-2">
                  <span
                    class="px-2 py-0.5 rounded-md font-bold text-[10px]"
                    :class="prod.stock > 10 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'"
                  >
                    {{ prod.stock }} uds.
                  </span>

                  <!-- Quick Stock Modifier -->
                  <button @click="updateStock(prod, prod.stock + 5)" class="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-purple-400 font-bold" title="Añadir +5 stock">
                    +5
                  </button>
                </div>
              </td>
              <td class="p-3 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openEditModal(prod)" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]" title="Editar">
                    ✏️ Editar
                  </button>
                  <button @click="deleteProduct(prod.id)" class="px-2.5 py-1 rounded bg-red-950/60 hover:bg-red-900 text-red-300 text-[11px]" title="Eliminar">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="glass-panel max-w-xl w-full p-8 rounded-3xl border border-slate-700 space-y-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 class="text-lg font-bold font-display text-white">
            {{ isEditing ? 'Editar Producto' : 'Crear Nuevo Componente Electrónico' }}
          </h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <form @submit.prevent="saveProduct" class="space-y-3 text-xs">
          <div>
            <label class="block font-mono text-slate-400 mb-1">Nombre del Producto</label>
            <input v-model="form.name" required type="text" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-mono text-slate-400 mb-1">Slug URL</label>
              <input v-model="form.slug" required type="text" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" />
            </div>
            <div>
              <label class="block font-mono text-slate-400 mb-1">SKU Unico</label>
              <input v-model="form.sku" required type="text" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block font-mono text-slate-400 mb-1">Precio ($ USD)</label>
              <input v-model.number="form.price" required type="number" step="0.01" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" />
            </div>
            <div>
              <label class="block font-mono text-slate-400 mb-1">Stock Inicial</label>
              <input v-model.number="form.stock" required type="number" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" />
            </div>
            <div>
              <label class="block font-mono text-slate-400 mb-1">Categoría</label>
              <select v-model="form.categoryId" required class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white">
                <option v-for="cat in productStore.categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-mono text-slate-400 mb-1">URL de Imagen</label>
            <input v-model="form.image" required type="url" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" />
          </div>

          <div>
            <label class="block font-mono text-slate-400 mb-1">Descripción</label>
            <textarea v-model="form.description" rows="3" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"></textarea>
          </div>

          <label class="flex items-center gap-2 cursor-pointer pt-2">
            <input type="checkbox" v-model="form.featured" class="w-4 h-4 rounded bg-slate-900 border-slate-700 text-purple-500" />
            <span class="text-slate-300 font-bold">Destacar en la portada (Top Deal)</span>
          </label>

          <div class="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button type="button" @click="showModal = false" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
              Cancelar
            </button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold">
              Guardar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useProductStore } from '~/stores/product';

definePageMeta({
  layout: 'admin'
});

const authStore = useAuthStore();
const productStore = useProductStore();

const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);

const form = ref({
  name: '',
  slug: '',
  sku: '',
  price: 0,
  stock: 0,
  categoryId: '',
  image: '',
  description: '',
  featured: false
});

onMounted(() => {
  productStore.fetchCategories();
  productStore.fetchProducts({ limit: 100 });
});

const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  form.value = {
    name: '',
    slug: '',
    sku: `MCU-${Math.floor(1000 + Math.random() * 9000)}`,
    price: 9.99,
    stock: 20,
    categoryId: productStore.categories[0]?.id || '',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    description: 'Componente electrónico de alto rendimiento.',
    featured: false
  };
  showModal.value = true;
};

const openEditModal = (prod: any) => {
  isEditing.value = true;
  editingId.value = prod.id;
  form.value = { ...prod };
  showModal.value = true;
};

const updateStock = async (prod: any, newStock: number) => {
  const config = useRuntimeConfig();
  try {
    await $fetch(`${config.public.apiBase}/products/${prod.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: { stock: newStock }
    });
    productStore.fetchProducts({ limit: 100 });
  } catch (err) {
    console.error('Error updating stock:', err);
  }
};

const saveProduct = async () => {
  const config = useRuntimeConfig();
  try {
    if (isEditing.value && editingId.value) {
      await $fetch(`${config.public.apiBase}/products/${editingId.value}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: form.value
      });
    } else {
      await $fetch(`${config.public.apiBase}/products`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: form.value
      });
    }
    showModal.value = false;
    productStore.fetchProducts({ limit: 100 });
  } catch (err: any) {
    alert(err.data?.error || 'Error al guardar el producto.');
  }
};

const deleteProduct = async (id: string) => {
  if (!confirm('¿Estás seguro de eliminar este producto?')) return;
  const config = useRuntimeConfig();
  try {
    await $fetch(`${config.public.apiBase}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    productStore.fetchProducts({ limit: 100 });
  } catch (err) {
    console.error('Error deleting product:', err);
  }
};
</script>
