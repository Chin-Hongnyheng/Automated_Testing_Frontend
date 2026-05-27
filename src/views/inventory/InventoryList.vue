<template>
  <div class="page">
    <nav>
      <h1>Warehouse System</h1>
      <div class="nav-links">
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/suppliers">Suppliers</router-link>
        <button @click="logout">Logout</button>
      </div>
    </nav>
    <div class="content">
      <div class="header">
        <h2>Inventory</h2>
        <button @click="$router.push('/inventory/create')" data-testid="create-button">
          + Add Item
        </button>
      </div>

      <div v-if="lowStockItems.length" class="alert" data-testid="low-stock-alert">
        ⚠️ {{ lowStockItems.length }} item(s) are low on stock!
      </div>

      <div v-if="loading">Loading...</div>
      <div v-else-if="error" class="error" data-testid="error-message">{{ error }}</div>
      <table v-else data-testid="inventory-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Stock Level</th>
            <th>Min Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item.id"
            :data-testid="`inventory-row-${item.id}`"
            :class="{ 'low-stock': item.stockLevel < item.minStockLevel }"
          >
            <td>{{ item.name }}</td>
            <td>{{ item.description }}</td>
            <td>{{ item.quantity }}</td>
            <td>${{ item.price }}</td>
            <td>{{ item.stockLevel }}</td>
            <td>{{ item.minStockLevel }}</td>
            <td>
              <button @click="editItem(item)" data-testid="edit-button">Edit</button>
              <button @click="adjustStock(item)" data-testid="adjust-button">Adjust</button>
              <button @click="deleteItem(item.id)" data-testid="delete-button" class="danger">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Adjust Stock Modal -->
      <div v-if="showAdjust" class="modal" data-testid="adjust-modal">
        <div class="modal-box">
          <h3>Adjust Stock - {{ selectedItem?.name }}</h3>
          <input
            v-model.number="adjustAmount"
            type="number"
            placeholder="Amount (use - to decrease)"
            data-testid="adjust-input"
          />
          <div class="modal-actions">
            <button @click="confirmAdjust" data-testid="confirm-adjust">Confirm</button>
            <button @click="showAdjust = false">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { useAuthStore } from '../../stores/auth'
import {
  GET_INVENTORIES,
  GET_LOW_STOCK,
  DELETE_INVENTORY,
  ADJUST_STOCK,
} from '../../graphql/inventory'
import { apolloClient } from '../../apollo'

const router = useRouter()
const auth = useAuthStore()

const { result, loading, error, refetch } = useQuery(GET_INVENTORIES, null, {
  context: { headers: { Authorization: `Bearer ${auth.token}` } },
})

const { result: lowStockResult } = useQuery(GET_LOW_STOCK, null, {
  context: { headers: { Authorization: `Bearer ${auth.token}` } },
})

const items = computed(() => result.value?.getInventories || [])
const lowStockItems = computed(() => lowStockResult.value?.getLowStockItems || [])

const { mutate: deleteMutate } = useMutation(DELETE_INVENTORY)
const { mutate: adjustMutate } = useMutation(ADJUST_STOCK)

const showAdjust = ref(false)
const selectedItem = ref<any>(null)
const adjustAmount = ref(0)

function logout() {
  auth.logout()
  router.push('/login')
}

function editItem(item: any) {
  router.push(`/inventory/edit/${item.id}`)
}

function adjustStock(item: any) {
  selectedItem.value = item
  adjustAmount.value = 0
  showAdjust.value = true
}

async function confirmAdjust() {
  try {
    await adjustMutate(
      { input: { id: selectedItem.value.id, amount: adjustAmount.value } },
      { context: { headers: { Authorization: `Bearer ${auth.token}` } } },
    )
    showAdjust.value = false
    refetch()
  } catch (e: any) {
    alert(e.message)
  }
}

async function deleteItem(id: string) {
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
.low-stock {
  background: #fff3cd;
}
.alert {
  background: #fff3cd;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}
.error {
  color: red;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
}
.modal-box input {
  width: 100%;
  padding: 0.75rem;
  margin: 1rem 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}
.modal-actions {
  display: flex;
  gap: 1rem;
}
</style>
