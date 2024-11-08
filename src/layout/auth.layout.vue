<template>
    <div
        class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <RouterView />
        </div>
    </div>
    <Toast />
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>
