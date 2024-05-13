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
    categories: []
})

defineOptions({
    inheritAttrs: false
})

onMounted(() => {
    loadCategories();
})

function loadCategories() {
    fetch(`${props.apiUrl}/categories`)
        .then(resp => resp.json())
        .then(apiObj => {
            if (apiObj && apiObj.data) {
                vm.categories = apiObj.data
            } else {
                alert(apiObj.error?.message)
            }
        })
}

function goToRecipes(name) {
    router.push(`/recipes?category=${name}`)
}

</script>

<template>
    <div>
        <div id="welcome-header">
            <h1 class="text-center">Hello, {{ props.user.username ?? "friend" }}!</h1>
            <p class="text-center">Welcome to RecYipee! Our mission is to cut out all the unnecessary bloat found in
                recipe websites, including long blog posts and ads.</p>
        </div>
        <div class="d-flex justify-content-center">
            <div id="carouselSlides" class="carousel slide carousel-fade" data-bs-ride="carousel">
                <div class="carousel inner">
                    <div @click="goToRecipes(c.name)" :class="{ 'carousel-item': true, 'active': index == 0 }"
                        data-bs-interval="5000" v-for="(c, index) in vm.categories" style="cursor:pointer">
                        <img :src="`/food/${c.name.toLowerCase()}.jpg`" class="d-block mx-auto"></img>
                        <div class="carousel-caption d-none d-md-block">
                            <h5>{{ c.name }}</h5>
                        </div>
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselSlides" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselSlides" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
        <h4 class="text-center mt-3">Want to see them all?</h4>
        <div class="row row-cols-2 row-cols-md-4">
            <div class="col p-2" v-for="c in vm.categories">
                <div class="card" @click="goToRecipes(c.name)" style="cursor:pointer">
                    <img class="card-img-top" :alt="c.name" :src="`/food/${c.name.toLowerCase()}.jpg`"></img>
                    <div class="card-body">
                        <h4 class="card-title">{{ c.name }}</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import 'bootstrap';
@import 'datatables.net-bs5';
</style>