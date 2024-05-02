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
</script>

<template>
    <h1>Hello, {{props.user.username}}!</h1>
</template>