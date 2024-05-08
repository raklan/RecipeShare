<script setup>

import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5'
import 'datatables.net-responsive'
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';

DataTable.use(DataTablesCore)

const router = useRouter()

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
                title: "Name",
                data: 'name',
                render: {
                    display(data, type, row) {
                        return `<a href="/recipe/${row.id}">${data}</a>`
                    }
                }
            },
            {
                title: "Difficulty",
                data: 'difficulty',
                render: {
                    display(d, t, r) {
                        return `${d}/5`
                    }
                }
            },
            {
                title: "Prep Time",
                data: 'preptime'
            },
            {
                title: "Cost",
                data: "cost",
                render: {
                    display(d, t, r) {
                        return `$${d}`
                    }
                }
            },
            {
                title: "Public?",
                data: "private",
                render: {
                    display(d, t, r) {
                        if (d == 0) {
                            return "✅"
                        }
                        return "❌"
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
                vm.recipes = apiObj.data.filter(r => r.private > 0 ? r.author == props.user?.username : true)
            }
            else {
                alert(apiObj.error?.message)
            }
        })
})

function goToRecipe(id) {
    router.push({ path: `/recipe/${id}` })
}
</script>

<template>
    <div>
        <h1>Hello, {{ props.user.username ? props.user.username : "friend" }}!</h1>
        <DataTable class="table table-responsive table-nowrap table-row-border table-hover table-compact"
            :options="vm.dtOptions" :data="vm.recipes"></DataTable>
    </div>
</template>

<style scoped>
@import 'bootstrap';
@import 'datatables.net-bs5';
</style>