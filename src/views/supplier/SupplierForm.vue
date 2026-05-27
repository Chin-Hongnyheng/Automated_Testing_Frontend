<template>
  <div class="page">
    <nav>
      <h1>Warehouse System</h1>
      <div class="nav-links">
        <router-link to="/suppliers">Back to Suppliers</router-link>
      </div>
    </nav>
    <div class="content">
      <h2>{{ isEdit ? 'Edit Supplier' : 'Create Supplier' }}</h2>
      <p v-if="error" class="error" data-testid="error-message">{{ error }}</p>
      <form @submit.prevent="handleSubmit" data-testid="supplier-form">
        <input v-model="form.name" placeholder="Name" data-testid="name-input" required />
        <input
          v-model="form.email"
          type="email"
          placeholder="Email"
          data-testid="email-input"
          required
        />
        <input v-model="form.phone" placeholder="Phone" data-testid="phone-input" required />
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
import { CREATE_SUPPLIER, UPDATE_SUPPLIER, GET_SUPPLIER } from '../../graphql/supplier'

const router = useRouter()
const route = useRoute()

const supplierId = computed(() => route.params.id as string)
const isEdit = computed(() => !!supplierId.value)
const loading = ref(false)
const error = ref('')

const form = ref({ name: '', email: '', phone: '' })

const { mutate: createMutate } = useMutation(CREATE_SUPPLIER)
const { mutate: updateMutate } = useMutation(UPDATE_SUPPLIER)

// Pull data safely via execution conditional parameters
const { onResult } = useQuery(
  GET_SUPPLIER,
  () => ({ id: supplierId.value }),
  () => ({ enabled: isEdit.value }),
)

onResult((result) => {
  const supplier = result.data?.getSupplier
  if (supplier) {
    form.value = {
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
    }
  }
})

async function handleSubmit() {
  try {
    loading.value = true
    error.value = ''

    const { ...inputData } = form.value

    if (isEdit.value) {
      await updateMutate({
        input: { id: supplierId.value, ...inputData },
      })
    } else {
      await createMutate({
        input: form.value,
      })
    }
    router.push('/suppliers')
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
