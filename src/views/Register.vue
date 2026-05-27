<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>Register</h2>
      <p v-if="error" class="error" data-testid="error-message">{{ error }}</p>
      <p v-if="success" class="success" data-testid="success-message">{{ success }}</p>
      <form @submit.prevent="handleRegister">
        <input
          v-model="userName"
          type="text"
          placeholder="Username"
          data-testid="username-input"
          required
        />
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
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          data-testid="confirm-password-input"
          required
        />
        <button type="submit" data-testid="register-button" :disabled="loading">
          {{ loading ? 'Loading...' : 'Register' }}
        </button>
      </form>
      <p>Already have an account? <router-link to="/login">Login</router-link></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable'
import { useAuthStore } from '../stores/auth'
import { REGISTER } from '../graphql/auth'

const router = useRouter()
const auth = useAuthStore()
const userName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

const { mutate } = useMutation(REGISTER)

async function handleRegister() {
  try {
    loading.value = true
    error.value = ''
    const result = await mutate({
      input: {
        userName: userName.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
      },
    })
    if (result?.data?.register?.accessToken) {
      auth.setToken(result.data.register.accessToken)
      router.push('/dashboard')
    }
  } catch (e: any) {
    error.value = e.message || 'Registration failed'
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
.success {
  color: green;
  margin-bottom: 1rem;
}
</style>
