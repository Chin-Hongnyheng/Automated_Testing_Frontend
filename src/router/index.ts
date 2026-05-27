import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import InventoryList from '../views/inventory/InventoryList.vue'
import InventoryForm from '../views/inventory/InventoryForm.vue'
import SupplierList from '../views/supplier/SupplierList.vue'
import SupplierForm from '../views/supplier/SupplierForm.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    {
      path: '/dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/inventory',
      component: InventoryList,
      meta: { requiresAuth: true },
    },
    {
      path: '/inventory/create',
      component: InventoryForm,
      meta: { requiresAuth: true },
    },
    {
      path: '/inventory/edit/:id',
      component: InventoryForm,
      meta: { requiresAuth: true },
    },
    {
      path: '/suppliers',
      component: SupplierList,
      meta: { requiresAuth: true },
    },
    {
      path: '/suppliers/create',
      component: SupplierForm,
      meta: { requiresAuth: true },
    },
    {
      path: '/suppliers/edit/:id',
      component: SupplierForm,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login'
  }
})

export default router
