<script setup>
const props = defineProps({
    apiUrl: {
        type: String,
        required: true
    },
    user: {
        type: Object,
        required: true
    }
})

defineOptions({
    inheritAttrs: false
})
</script>

<template>
    <h1 class="text-3xl font-bold underline">Hello, {{ props.user.username }}!</h1>
</template>