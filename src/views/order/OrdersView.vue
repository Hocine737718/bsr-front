<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { getAllOrders } from '@/services/order.service';
import type { OrderInterface } from '@/services/interface/order.interface';

const toast = useToast();

const orders = ref<OrderInterface[] | null>(null);

onBeforeMount(async () => {
    orders.value = await getAllOrders();
})

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card" v-if="orders">
                {{ orders.length }}
            </div>
        </div>
    </div>
</template>
