<script lang="ts" setup>
import { api } from '@/services/api';
import { Login } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
const name = ref('BSR');
const password = ref('BSR@@2024');
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

interface AuthState {
    accessToken: string | null;
    user: any | null;
}

onBeforeMount(() => {
    if (authStore.user && authStore.isLoggedIn()) {
        router.push("/");
    }
});

const login = async () => {
    try {
        const response: any = await Login({
            name: name.value,
            password: password.value,
        });
        if (response) {
            const { accessToken, user }: AuthState = response;
            authStore.set({ accessToken, user });
            toast.add({ severity: 'success', summary: 'Success', detail: 'Bienvenue !!', life: 3000 });
            api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            router.replace("/");
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Erreur !!', life: 3000 });
        }
    } catch (error) {
        console.log(`output->error`, error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Erreur !!', life: 3000 });
    }
};
</script>
<template>
    <div
        style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
            <div class="text-center mb-5">
                <img src="/assets/images/logo.png" alt="Image" height="50" class="mb-3" />
                <div class="text-900 text-3xl font-medium mb-3">Bienvenue, BSR!</div>
                <span class="text-600 font-medium">CONNEXION</span>
            </div>

            <div>
                <label for="name1" class="block text-900 text-xl font-medium mb-2">Nom</label>
                <InputText id="name1" type="text" placeholder="User name" class="w-full md:w-30rem mb-5"
                    style="padding: 1rem" v-model="name" />

                <label for="password1" class="block text-900 font-medium text-xl mb-2">Mot de passe</label>
                <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true"
                    class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
                <Button label="Se Connecter" class="w-full p-3 text-xl" @click="login"></Button>
            </div>
        </div>
    </div>
</template>