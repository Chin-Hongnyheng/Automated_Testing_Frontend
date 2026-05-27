<template>
  <div class="page">
    <nav>
      <h1>Warehouse System</h1>
      <div class="nav-links">
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/inventory">Inventory</router-link>
        <button @click="logout">Logout</button>
      </div>
    </nav>
    <div class="content">
      <div class="header">
        <h2>Suppliers</h2>
        <button @click="$router.push('/suppliers/create')" data-testid="create-button">
          + Add Supplier
        </button>
      </div>
      <div v-if="loading">Loading...</div>
      <div v-else-if="error" class="error" data-testid="error-message">{{ error }}</div>
      <table v-else data-testid="supplier-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="supplier in suppliers"
            :key="supplier.id"
            :data-testid="`supplier-row-${supplier.id}`"
          >
            <td class="id-cell">{{ supplier.id }}</td>
            <td>{{ supplier.name }}</td>
            <td>{{ supplier.email }}</td>
            <td>{{ supplier.phone }}</td>
            <td>
              <button
                @click="$router.push(`/suppliers/edit/${supplier.id}`)"
                data-testid="edit-button"
              >
                Edit
              </button>
              <button
                @click="deleteSupplier(supplier.id)"
                data-testid="delete-button"
                class="danger"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { useAuthStore } from '../../stores/auth'
import { GET_SUPPLIERS, DELETE_SUPPLIER } from '../../graphql/supplier'

const router = useRouter()
const auth = useAuthStore()

const { result, loading, error, refetch } = useQuery(GET_SUPPLIERS, null, {
  context: { headers: { Authorization: `Bearer ${auth.token}` } },
})

const suppliers = computed(() => result.value?.getSuppliers || [])
const { mutate: deleteMutate } = useMutation(DELETE_SUPPLIER)

function logout() {
  auth.logout()
  router.push('/login')
}

async function deleteSupplier(id: string) {
  if (!confirm('Are you sure?')) return
  try {
    await deleteMutate({ id }, { context: { headers: { Authorization: `Bearer ${auth.token}` } } })
    refetch()
  } catch (e: any) {
    alert(e.message)
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
.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.nav-links a {
  color: white;
  text-decoration: none;
}
.nav-links button {
  padding: 0.5rem 1rem;
  background: white;
  color: #4f46e5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.content {
  padding: 2rem;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.header button {
  padding: 0.5rem 1rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}
th,
td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}
th {
  background: #f5f5f5;
}
button {
  padding: 0.4rem 0.8rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #4f46e5;
  color: white;
}
button.danger {
  background: #ef4444;
}
.error {
  color: red;
}
</style>
