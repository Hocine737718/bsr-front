<script setup lang="ts">
import { ref } from 'vue';

import AppMenuItem from '@/components/app/AppMenuItem.vue';

const model: any = ref([
    {
        label: 'Home',
        items: [
            { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Commandes', icon: 'pi pi-fw pi-shopping-cart', to: '/orders' },
            { label: 'Produits', icon: 'pi pi-fw pi-shopping-cart', to: '/products' }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
