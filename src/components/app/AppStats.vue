<template>
    <div class="col-12 lg:col-6 xl:col-3">
        <div class="card mb-0">
            <div class="flex justify-content-between mb-3">
                <div>
                    <span class="block text-500 font-medium mb-3">{{ label }}</span>
                    <div class="text-900 font-medium text-xl">{{ number }}</div>
                </div>
                <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
                    style="width: 2.5rem; height: 2.5rem">
                    <i :class="icon"></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
defineProps({
    label: {
        type: String,
        defaultValue: ""
    },
    number: {
        type: Number,
        defaultValue: 0
    },
    icon: {
        type: String,
        defaultValue: ""
    }
})
</script>