<template>
  <div class="dashboard">
    <nav>
      <h1>Warehouse System</h1>
      <div class="nav-links">
        <router-link to="/inventory">Inventory</router-link>
        <router-link to="/suppliers">Suppliers</router-link>
        <button @click="logout" data-testid="logout-button">Logout</button>
      </div>
    </nav>
    <div class="content">
      <h2>Dashboard</h2>
      <div class="cards">
        <div class="card" data-testid="inventory-card" @click="$router.push('/inventory')">
          <h3>Inventory</h3>
          <p>Manage your inventory items</p>
        </div>
        <div class="card" data-testid="supplier-card" @click="$router.push('/suppliers')">
          <h3>Suppliers</h3>
          <p>Manage your suppliers</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

function logout() {
  auth.logout()
  router.push('/login')
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
.cards {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
.card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  width: 200px;
}
.card:hover {
  background: #f5f5f5;
}
</style>
