<script setup>

import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5'
import 'datatables.net-responsive'
import { onMounted, reactive } from 'vue';

DataTable.use(DataTablesCore)

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
    recipes: [],
    dtOptions: {
        responsive: true,
        order: [[0, 'asc']],
        columns: [
            {
                title: "Name", data: 'name'
            },
            {
                title: "Difficulty",
                data: 'difficulty',
                render: {
                    display(d, t, r){
                        return `${d}/5`
                    }
                }
            }
        ]
    }
})

defineOptions({
    inheritAttrs: false
})

onMounted(() => {
    fetch(`${props.apiUrl}/recipes`)
        .then(resp => resp.json())
        .then(apiObj => {
            if (apiObj && apiObj.data) {
                vm.recipes = apiObj.data
            }
            else {
                alert(apiObj.error?.message)
            }
        })
})
</script>

<template>
    <div>
        <h1>Hello, {{ props.user.username }}!</h1>
        <DataTable class="table table-responsive table-nowrap table-row-border table-hover table-compact" :options="vm.dtOptions" :data="vm.recipes"></DataTable>
    </div>
</template>

<style scoped>
@import 'bootstrap';
@import 'datatables.net-bs5';
</style>