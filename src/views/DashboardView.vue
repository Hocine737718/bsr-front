<script lang="ts" setup>
import AppStats from '@/components/app/AppStats.vue';
import { getAllCustomers } from '@/services/customer.service';
import { getAllOrders } from '@/services/order.service';
import { getAllProducts } from '@/services/product.service';
import { onBeforeMount, ref } from 'vue';
const stats = ref({
    ordersLength: 0,
    // customersLength: 0,
    productsLength: 0
})
onBeforeMount(async () => {
    let listOrders = await getAllOrders();
    // let listCustomers = await getAllCustomers();
    let listProducts = await getAllProducts();
    stats.value.ordersLength = listOrders.length;
    // stats.value.customersLength = listCustomers.length;
    stats.value.productsLength = listProducts.length;
})
</script>
<template>
    <div class="grid">
        <AppStats label="Commandes" icon="pi pi-shopping-cart text-blue-500 text-xl" :number="stats.ordersLength" />
        <AppStats label="Produits" icon="pi pi-shopping-cart text-blue-500 text-xl" :number="stats.productsLength" />
        <!-- <AppStats label="Clients" icon="pi pi-shopping-cart text-blue-500 text-xl" :number="stats.customersLength" /> -->
    </div>
</template>