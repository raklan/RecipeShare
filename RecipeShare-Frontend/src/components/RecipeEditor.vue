<script setup>
import { reactive } from 'vue'

const props = defineProps({
    user: {
        type: Object,
        required: true
    },
    apiUrl: {
        type: String,
        required: true
    }
})

const vm = reactive({
    recipe: {}
})

function diffSelect(event) {
    console.log(event.target.value)
    vm.recipe.difficulty = event.target.value
}
</script>

<template>
    <div>
        <div id="recipe-name">
            <label for="name">Name:</label>
            <input type="text" name="name" v-model="vm.recipe.name" />
        </div>
        <div id="recipe-preptime">
            <label for="preptime">Prep Time:</label>
            <input type="text" name="preptime" v-model="vm.recipe.preptime" />
        </div>
        <form @change="diffSelect" id="difficulty-form">
            <div class="rating">
                <input value="5" name="rating" id="star5" type="radio">
                <label for="star5"></label>
                <input value="4" name="rating" id="star4" type="radio">
                <label for="star4"></label>
                <input value="3" name="rating" id="star3" type="radio">
                <label for="star3"></label>
                <input value="2" name="rating" id="star2" type="radio">
                <label for="star2"></label>
                <input value="1" name="rating" id="star1" type="radio">
                <label for="star1"></label>
            </div>

        </form>
        <div id="recipe-cost">
            <label for="cost">Cost:</label>
            <input type="number" name="cost" v-model="vm.recipe.cost" />
        </div>
        <div id="recipe-name">
            <label for="name">Private?</label>
            <input type="checkbox" name="name" v-model="vm.recipe.private" />
        </div>
    </div>
</template>

<style scoped>
.rating {
    display: inline-block;
}

.rating input {
    display: none;
}

.rating label {
    float: right;
    cursor: pointer;
    color: #c5c5c5;
    transition: color 0.3s;
}

.rating label:before {
    content: '\2605';
    font-size: 30px;
}

.rating input:checked~label,
.rating label:hover,
.rating label:hover~label {
    color: #1a1a1a;
    transition: color 0.3s;
}
</style>