<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router'
import AuthLayout from "./layout/auth.layout.vue";
import DefaultLayout from "./layout/default.layout.vue";
const route = useRoute();
const layout = computed(() => {
  return route.meta.layout;
});
</script>

<template>
  <auth-layout v-if="layout === 'auth'" />
  <default-layout v-if="layout === 'default'" />
</template>

<style scoped>

</style>
