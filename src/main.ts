import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Toast, { POSITION } from 'vue-toastification'
import App from './App.vue'
import router from './router'
const app = createApp(App)
app.use(router)
const pinia = createPinia()
app.use(pinia)
pinia.use(piniaPluginPersistedstate)
const toastOptions = {
    position: POSITION.TOP_RIGHT,
    timeout: 5000,
    hideProgressBar: true
}
app.use(Toast, toastOptions)
app.use(router)
const head = createHead()
app.use(head)
app.use(PrimeVue, { ripple: true });
app.mount('#app')
