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
                        if(data && data.length > 0){
                            return `<a href="/recipe/${row.id}">${data}</a>`
                        }else{
                            return `<a href="/recipe/${row.id}">Name not found</a>`
                        }
                    }
                }
            },
            {
                title: "Difficulty",
                data: 'difficulty',
                render: {
                    display(d, t, r) {
                        if(d){
                            return `${d}/5`
                        }else{
                            return ``
                        }
                    }
                }
            },
            {
                title: "Prep Time",
                data: 'preptime'
            },
            {
                title: "Categories",
                data: "categories"
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
    if(router.currentRoute.value.query.category){
        var fetchUrl = `${props.apiUrl}/recipes?category=${router.currentRoute.value.query.category}`
    }
    else{
        var fetchUrl = `${props.apiUrl}/recipes`
    }
    fetch(fetchUrl)
        .then(resp => resp.json())
        .then(apiObj => {
            if (apiObj && apiObj.data) {
                vm.recipes = apiObj.data.filter(r => r.private > 0 ? r.author == props.user?.username : true)
                //Map the categories list to a string of comma-separated categories.
                //Doing this here instead of the datatable's rendering so that DataTables can see it as a searchable string,
                //which lets the user search by category
                vm.recipes.forEach(r => {
                    if(r.categories && r.categories.length > 0){
                        r.categories = r.categories.map(c => c.name).sort().join(", ")
                    }
                })
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
    <h3 v-if="$route.query.category">Viewing Recipes with Category: {{ $route.query.category }}</h3>
    <div>
        <DataTable class="table table-responsive table-nowrap table-row-border table-hover table-compact"
            :options="vm.dtOptions" :data="vm.recipes"></DataTable>
    </div>
</template>

<style scoped>
@import 'bootstrap';
@import 'datatables.net-bs5';
</style>