<script setup>
import { reactive } from 'vue'
import Button from './Button.vue'

defineOptions({
  inheritAttrs: false
})

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
    recipe: {
        author: props.user.username
    },
    ingredientSets: [],
    ingredientToAdd: '',
    is_currentEdit: [],
    stepSets: [],
    stepToAdd: '',
    ss_currentEdit: []
})

function diffSelect(event) {
    console.log(event.target.value)
    vm.recipe.difficulty = event.target.value
}

function addIngredientSet(event){
    vm.ingredientSets.push([])
}

function addIngredient(is, index){
    const ing = document.getElementById(`addIngredient${index}`)
    is.push(ing.value)
    ing.value = 'new value'
    console.log(ing.value)
}

function addStepSet(event){
    vm.stepSets.push([])
}

function addStep(steps){
    steps.push(vm.stepToAdd)
    vm.stepToAdd = ''
}

function save(){
    const reqBody = {
        recipe: vm.recipe,
        ingredientSets: vm.ingredientSets,
        stepSets: vm.stepSets
    }
    fetch(`${props.apiUrl}/createRecipe`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
    })
        .then(resp => resp.json())
        .then(apiObj => {
            if(apiObj && !apiObj.error){

            }else{
                alert(apiObj?.error)
            }
        })
}
</script>

<template>
    <Button @click="save">Save</Button>
    <div id="editor" class="flex justify-around">
        <div id="recipe-details">
            <div id="recipe-name" class="mb-6">
                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name:</label>
                <input id="name" type="text" autocomplete="off" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" v-model="vm.recipe.name" />
            </div>
            <div id="recipe-preptime" class="mb-6">
                <label for="preptime" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Prep Time:</label>
                <input id="preptime" type="text" autocomplete="off" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" v-model="vm.recipe.preptime" />
            </div>
            <form @change="diffSelect" id="difficulty-form" class="mb-6">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Difficulty</label>
                <div id="rating-stars" class="rating">
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
            <div id="recipe-cost" class="mb-6">
                <label for="cost" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cost: (USD)</label>                
                <input type="number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" id="cost" v-model="vm.recipe.cost" />
            </div>
            <div id="recipe-name" class="flex items-center mb-4">
                <label for="private-checkbox"  class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2">Private?</label>
                <input id="private-checkbox" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" v-model="vm.recipe.private" />
            </div>
        </div>
    
        <div id="ingredient-set-editor">
            <h3>Ingredient Sets</h3>
            <Button @click="addIngredientSet">Add Set</Button>
            <div v-for="(is, index) in vm.ingredientSets">
                <h5>Ingredient Set {{ index + 1 }}</h5>
                <input :id="`addIngredient${index}`" v-model="vm.ingredientToAdd"/>
                <Button @click="addIngredient(is, index)">Add Ingredient</Button>   
                <p v-for="ing in is">{{ ing }}</p>
            </div>
        </div>
    
        <div id="step-set-editor">
            <h3>Step Sets</h3>
            <Button @click="addStepSet">Add Set</Button>
            <div v-for="(steps, index) in vm.stepSets">
                <h5>Step Set {{ index + 1 }}</h5>
                <input v-model="vm.stepToAdd"/>
                <Button @click="addStep(steps)">Add Step</Button>   
                <p v-for="step in steps">{{ step }}</p>
            </div>
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