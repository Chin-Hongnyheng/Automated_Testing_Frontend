<template>
  <div class="page">
    <nav>
      <h1>Warehouse System</h1>
      <div class="nav-links">
        <router-link to="/inventory">Back to Inventory</router-link>
      </div>
    </nav>
    <div class="content">
      <h2>{{ isEdit ? 'Edit Item' : 'Create Item' }}</h2>
      <p v-if="error" class="error" data-testid="error-message">{{ error }}</p>
      <form @submit.prevent="handleSubmit" data-testid="inventory-form">
        <input v-model="form.name" placeholder="Name" data-testid="name-input" required />
        <input
          v-model="form.description"
          placeholder="Description"
          data-testid="description-input"
          required
        />
        <input
          v-model.number="form.quantity"
          type="number"
          placeholder="Quantity"
          data-testid="quantity-input"
          required
        />
        <input
          v-model.number="form.price"
          type="number"
          step="0.01"
          placeholder="Price"
          data-testid="price-input"
          required
        />
        <input
          v-model="form.supplierId"
          placeholder="Supplier ID"
          data-testid="supplier-input"
          required
        />
        <input
          v-model.number="form.stockLevel"
          type="number"
          placeholder="Stock Level"
          data-testid="stock-input"
          required
        />
        <input
          v-model.number="form.minStockLevel"
          type="number"
          placeholder="Min Stock Level"
          data-testid="min-stock-input"
          required
        />
        <button type="submit" data-testid="submit-button" :disabled="loading">
          {{ loading ? 'Saving...' : isEdit ? 'Update' : 'Create' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { CREATE_INVENTORY, UPDATE_INVENTORY, GET_INVENTORY } from '../../graphql/inventory'

const router = useRouter()
const route = useRoute()

const itemId = computed(() => route.params.id as string)
const isEdit = computed(() => !!itemId.value)
const loading = ref(false)
const error = ref('')

const form = ref({
  name: '',
  description: '',
  quantity: 0,
  price: 0,
  supplierId: '',
  stockLevel: 0,
  minStockLevel: 0,
})

const { mutate: createMutate } = useMutation(CREATE_INVENTORY)
const { mutate: updateMutate } = useMutation(UPDATE_INVENTORY)

// Extracted hook cleanly out of the conditional block using the enabled flag
const { onResult } = useQuery(
  GET_INVENTORY,
  () => ({ id: itemId.value }),
  () => ({ enabled: isEdit.value }),
)

onResult((result) => {
  const item = result.data?.getInventory
  if (item) {
    form.value = {
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      price: item.price,
      supplierId: item.supplierId,
      stockLevel: item.stockLevel,
      minStockLevel: item.minStockLevel,
    }
  }
})

async function handleSubmit() {
  try {
    loading.value = true
    error.value = ''

    // Extracted ID property from the inner variables context
    const { ...inputData } = form.value

    if (isEdit.value) {
      await updateMutate({
        input: { id: itemId.value, ...inputData },
      })
    } else {
      await createMutate({
        input: form.value,
      })
    }
    router.push('/inventory')
  } catch (e: any) {
    error.value = e.message || 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #4f46e5;
  color: white;
}
.nav-links a {
  color: white;
  text-decoration: none;
}
.content {
  padding: 2rem;
  max-width: 600px;
}
h2 {
  margin-bottom: 1rem;
}
input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}
button {
  padding: 0.75rem 2rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  opacity: 0.6;
}
.error {
  color: red;
  margin-bottom: 1rem;
}
</style>
