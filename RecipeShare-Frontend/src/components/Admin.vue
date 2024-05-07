<script setup>
import Button from './Button.vue'

import { reactive } from 'vue';

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

const vm = reactive({
    toSubmit: ''
});

function submit() {
    const reqBody = {
        query: vm.toSubmit,
        user: props.user
    }

    fetch(`${props.apiUrl}/adminSubmit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
    })
        .then(resp => resp.json())
        .then(apiObj => {
            console.log(apiObj)
            vm.toSubmit = ''
        })
}
</script>

<template>
    <input type="text"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        v-model="vm.toSubmit" />
    <Button @click="submit">Submit</Button>
</template>

<style scoped></style>