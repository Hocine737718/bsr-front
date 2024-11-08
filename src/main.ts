import '@/assets/styles.scss';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
// import Toast, { POSITION } from "vue-toastification";

const app = createApp(App)

// const toastOptions = {
//     position: POSITION.TOP_RIGHT,
//     timeout: 5000,
//     hideProgressBar: true,
// };
// app.use(Toast, toastOptions);

const pinia = createPinia()
app.use(pinia)
pinia.use(piniaPluginPersistedstate)

app.use(router)

app.use(PrimeVue, { ripple: true });
app.component('Button', Button);
app.component('Toast', Toast);
app.use(ToastService);
app.component('InputText', InputText);
app.component('Password', Password);

app.mount('#app')
