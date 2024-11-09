<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { getAllCustomers } from '@/services/customer.service';
import type { CustomerInterface } from '@/services/interface/customer.interface';

const toast = useToast();

const customers = ref<CustomerInterface[] | null>(null);

onBeforeMount(async () => {
    customers.value = await getAllCustomers();
})

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card" v-if="customers">
                {{ customers.length }}
            </div>
        </div>
    </div>
</template>
