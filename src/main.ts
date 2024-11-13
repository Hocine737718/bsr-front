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
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import IconField from 'primevue/iconfield';
import Textarea from 'primevue/textarea';
import InputIcon from 'primevue/inputicon';
import InputNumber from 'primevue/inputnumber';
import Toolbar from 'primevue/toolbar';
import Dialog from 'primevue/dialog';
import FileUpload from 'primevue/fileupload';

const app = createApp(App)

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
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('IconField', IconField);
app.component('Textarea', Textarea);
app.component('InputIcon', InputIcon);
app.component('InputNumber', InputNumber);
app.component('Toolbar', Toolbar);
app.component('Dialog', Dialog);
app.component('FileUpload', FileUpload);


app.mount('#app')
