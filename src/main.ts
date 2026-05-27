import { createApp, h, provide } from 'vue'
import { createPinia } from 'pinia'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient } from './apollo'
import App from './App.vue'
import router from './router'

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App),
})

// 1. Initialize Pinia FIRST
const pinia = createPinia()
app.use(pinia)

// 2. Then add the router
app.use(router)

app.mount('#app')
