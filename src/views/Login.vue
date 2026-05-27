<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>Login</h2>
      <p v-if="error" class="error" data-testid="error-message">{{ error }}</p>
      <form @submit.prevent="handleLogin">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          data-testid="email-input"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          data-testid="password-input"
          required
        />
        <button type="submit" data-testid="login-button" :disabled="loading">
          {{ loading ? 'Loading...' : 'Login' }}
        </button>
      </form>
      <p>Don't have an account? <router-link to="/register">Register</router-link></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable'
import { useAuthStore } from '../stores/auth'
import { LOGIN } from '../graphql/auth'

const router = useRouter()
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const { mutate } = useMutation(LOGIN)

async function handleLogin() {
  try {
    loading.value = true
    error.value = ''
    const result = await mutate({ input: { email: email.value, password: password.value } })
    if (result?.data?.login?.accessToken) {
      auth.setToken(result.data.login.accessToken)
      router.push('/dashboard')
    }
  } catch (e: any) {
    error.value = e.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.auth-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
  width: 100%;
  padding: 0.75rem;
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
