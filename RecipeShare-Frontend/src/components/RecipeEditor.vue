<script setup>
import { reactive, onMounted } from 'vue'
import Button from './Button.vue'
import Multiselect from 'vue-multiselect';
import { useRoute } from 'vue-router';

defineOptions({
    inheritAttrs: false
})

const route = useRoute()

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
        author: props.user.username,
        categories: [],
    },
    ingredientSets: [],
    ingredientToAdd: '',
    stepSets: [],
    stepToAdd: '',
    categoryOptions: []
})

function addIngredientSet(event) {
    vm.ingredientSets.push({ingredients: []})
}

function removeIngredientSet(index) {
    vm.ingredientSets = vm.ingredientSets.filter(s => vm.ingredientSets.indexOf(s) != index)
}

function ingredientBoxKeyPress(event, is, index) {
    if (event.code == "Enter") {
        event.preventDefault();
        addIngredient(is, index)
    }
}

function addIngredient(is, index) {
    const ing = document.getElementById(`addIngredient${index}`)
    if (ing.value && ing.value.length > 0) {
        is.ingredients.push(ing.value)
        ing.value = "";
    }
}

function addStepSet(event) {
    vm.stepSets.push({steps: []})
}

function removeStepSet(index) {
    vm.stepSets = vm.stepSets.filter(s => vm.stepSets.indexOf(s) != index)
}

function addStep(steps, index) {
    console.log(index)
    const step = document.getElementById(`addStep${index}`)
    if (step.value && step.value.length > 0) {
        steps.steps.push(step.value)
        step.value = ''
    }
}

function stepBoxKeyPress(event, steps, index) {
    if (event.code == "Enter") {
        event.preventDefault();
        addStep(steps, index)
    }
}

function loadCategories() {
    fetch(`${props.apiUrl}/categories`)
        .then(resp => resp.json())
        .then(apiObj => {
            if (apiObj && apiObj.data) {
                vm.categoryOptions = apiObj.data
            } else {
                alert(apiObj.error?.message)
            }
        })
}

function save() {
    const reqBody = {
        recipe: vm.recipe,
        ingredientSets: vm.ingredientSets,
        stepSets: vm.stepSets
    }

    let endpoint = "createRecipe"
    if(route.params?.id){
        endpoint = "saveRecipe"
    }

    fetch(`${props.apiUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
    })
        .then(resp => resp.json())
        .then(apiObj => {
            if (apiObj && !apiObj.error) {
                alert('success')
                if(!route.params?.id){
                    vm.recipe = {
                        author: props.user.username,
                        categories: []
                    }
                    vm.stepSets = []
                    vm.ingredientSets = []
                }
            } else {
                alert(apiObj?.error)
            }
        })

}

function loadRecipe(){
    fetch(`${props.apiUrl}/recipe?id=${route.params.id}`)
    .then(resp => resp.json())
    .then(apiObj => {
        if(apiObj && apiObj.data){
            const details = apiObj.data;
            vm.recipe = details.recipe;
            vm.ingredientSets = details.ingredientSets;
            vm.ingredientSets.forEach(is => {
                is.ingredients = JSON.parse(is.ingredients)
            })
            vm.stepSets = details.stepSets;
            vm.stepSets.forEach(ss => {
                ss.steps = JSON.parse(ss.steps)
            })
        }else{
            alert(apiObj.error?.message)
        }
    })
}

onMounted(() => {
    loadCategories();
    if(route.params?.id){
        loadRecipe()
    }
})
</script>

<template>
    <Button @click="save">Save</Button>
    <div id="editor" class="container-sm mb-3">
        <div class="row">
            <div id="recipe-details" class="col-md">
                <div id="recipe-name" class="mb-3">
                    <label for="name">Name:</label>
                    <input id="name" type="text" autocomplete="off" class="form-control" v-model="vm.recipe.name" />
                </div>
                <div id="recipe-preptime" class="mb-3">
                    <label for="preptime">Prep
                        Time:</label>
                    <input id="preptime" type="text" autocomplete="off" class="form-control"
                        v-model="vm.recipe.preptime" />
                </div>
                <div class="mb-3">
                    <label>Difficulty</label>
                    <div id="rating-stars" class="rating">
                        <input value="5" name="rating" id="star5" type="radio" v-model="vm.recipe.difficulty" :value="5">
                        <label for="star5"></label>
                        <input value="4" name="rating" id="star4" type="radio" v-model="vm.recipe.difficulty" :value="4">
                        <label for="star4"></label>
                        <input value="3" name="rating" id="star3" type="radio" v-model="vm.recipe.difficulty" :value="3">
                        <label for="star3"></label>
                        <input value="2" name="rating" id="star2" type="radio" v-model="vm.recipe.difficulty" :value="2">
                        <label for="star2"></label>
                        <input value="1" name="rating" id="star1" type="radio" v-model="vm.recipe.difficulty" :value="1">
                        <label for="star1"></label>
                    </div>
                </div>
                <div id="category-select" class="mb-3">
                    <label for="category-dropdown">Categories</label>
                    <Multiselect id="category-dropdown" v-model="vm.recipe.categories" :options="vm.categoryOptions"
                        :multiple="true" :close-on-select="false" :searchable="true" label="name" track-by="name"
                        placeholder="Choose some categories"></Multiselect>
                </div>
                <div id="recipe-name" class="mb-3 d-flex justify-content-start">
                    <label for="private-checkbox">Private?</label>
                    <input id="private-checkbox" type="checkbox" class="form-check mx-2" :checked="vm.recipe.private" v-model="vm.recipe.private" />
                </div>
            </div>

            <div id="ingredient-set-editor" class="col-md">
                <h3 class="text-lg fw-bold">Ingredient Sets</h3>
                <Button class="mb-2" @click="addIngredientSet">Add Set</Button>
                <div v-for="(is, index) in vm.ingredientSets">
                    <h5 class="d-flex justify-content-start">
                        <span class="m-3 fw-bold">Ingredient Set {{ index + 1 }}</span>
                        <button @click="removeIngredientSet(index)" class="deleteButton m-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 50 59" class="bin">
                                <path fill="#B5BAC1"
                                    d="M0 7.5C0 5.01472 2.01472 3 4.5 3H45.5C47.9853 3 50 5.01472 50 7.5V7.5C50 8.32843 49.3284 9 48.5 9H1.5C0.671571 9 0 8.32843 0 7.5V7.5Z">
                                </path>
                                <path fill="#B5BAC1"
                                    d="M17 3C17 1.34315 18.3431 0 20 0H29.3125C30.9694 0 32.3125 1.34315 32.3125 3V3H17V3Z">
                                </path>
                                <path fill="#B5BAC1"
                                    d="M2.18565 18.0974C2.08466 15.821 3.903 13.9202 6.18172 13.9202H43.8189C46.0976 13.9202 47.916 15.821 47.815 18.0975L46.1699 55.1775C46.0751 57.3155 44.314 59.0002 42.1739 59.0002H7.8268C5.68661 59.0002 3.92559 57.3155 3.83073 55.1775L2.18565 18.0974ZM18.0003 49.5402C16.6196 49.5402 15.5003 48.4209 15.5003 47.0402V24.9602C15.5003 23.5795 16.6196 22.4602 18.0003 22.4602C19.381 22.4602 20.5003 23.5795 20.5003 24.9602V47.0402C20.5003 48.4209 19.381 49.5402 18.0003 49.5402ZM29.5003 47.0402C29.5003 48.4209 30.6196 49.5402 32.0003 49.5402C33.381 49.5402 34.5003 48.4209 34.5003 47.0402V24.9602C34.5003 23.5795 33.381 22.4602 32.0003 22.4602C30.6196 22.4602 29.5003 23.5795 29.5003 24.9602V47.0402Z"
                                    clip-rule="evenodd" fill-rule="evenodd"></path>
                                <path fill="#B5BAC1" d="M2 13H48L47.6742 21.28H2.32031L2 13Z"></path>
                            </svg>
                        </button>
                    </h5>
                    <div class="input-group">
                        <input class="form-control" placeholder="Add an Ingredient..." autocomplete="off"
                            :id="`addIngredient${index}`"
                            @keypress="(event) => ingredientBoxKeyPress(event, is, index)" />
                        <Button class="text-center" @click="addIngredient(is, index)">Add Ingredient</Button>
                    </div>
                    <p v-for="(ing, i) in is.ingredients">{{ `${i + 1}: ${ing}` }}</p>
                </div>
            </div>

            <div id="step-set-editor" class="col-md">
                <h3 class="text-lg fw-bold">Step Sets</h3>
                <Button class="mb-2" @click="addStepSet">Add Set</Button>
                <div v-for="(steps, index) in vm.stepSets">
                    <h5 class="d-flex justify-content-start">
                        <span class="m-3 fw-bold">Set {{ index + 1 }}</span>
                        <button @click="removeStepSet(index)" class="deleteButton m-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 50 59" class="bin">
                                <path fill="#B5BAC1"
                                    d="M0 7.5C0 5.01472 2.01472 3 4.5 3H45.5C47.9853 3 50 5.01472 50 7.5V7.5C50 8.32843 49.3284 9 48.5 9H1.5C0.671571 9 0 8.32843 0 7.5V7.5Z">
                                </path>
                                <path fill="#B5BAC1"
                                    d="M17 3C17 1.34315 18.3431 0 20 0H29.3125C30.9694 0 32.3125 1.34315 32.3125 3V3H17V3Z">
                                </path>
                                <path fill="#B5BAC1"
                                    d="M2.18565 18.0974C2.08466 15.821 3.903 13.9202 6.18172 13.9202H43.8189C46.0976 13.9202 47.916 15.821 47.815 18.0975L46.1699 55.1775C46.0751 57.3155 44.314 59.0002 42.1739 59.0002H7.8268C5.68661 59.0002 3.92559 57.3155 3.83073 55.1775L2.18565 18.0974ZM18.0003 49.5402C16.6196 49.5402 15.5003 48.4209 15.5003 47.0402V24.9602C15.5003 23.5795 16.6196 22.4602 18.0003 22.4602C19.381 22.4602 20.5003 23.5795 20.5003 24.9602V47.0402C20.5003 48.4209 19.381 49.5402 18.0003 49.5402ZM29.5003 47.0402C29.5003 48.4209 30.6196 49.5402 32.0003 49.5402C33.381 49.5402 34.5003 48.4209 34.5003 47.0402V24.9602C34.5003 23.5795 33.381 22.4602 32.0003 22.4602C30.6196 22.4602 29.5003 23.5795 29.5003 24.9602V47.0402Z"
                                    clip-rule="evenodd" fill-rule="evenodd"></path>
                                <path fill="#B5BAC1" d="M2 13H48L47.6742 21.28H2.32031L2 13Z"></path>
                            </svg>
                        </button>
                    </h5>
                    <div class="input-group">
                        <input class="form-control" autocomplete="off" placeholder="Add a Step..."
                            :id="`addStep${index}`" @keypress="(event) => stepBoxKeyPress(event, steps, index)" />
                        <Button class="text-center" @click="addStep(steps, index)">Add Step</Button>
                    </div>
                    <p v-for="(step, i) in steps.steps">{{ `${i + 1}: ${step}` }}</p>
                </div>
            </div>
        </div>
    </div>

</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style scoped>
.rating {
    display: inline;
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

.deleteButton {
    width: 40px;
    height: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    background-color: transparent;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
}

.deleteButton svg {
    width: 44%;
}

.deleteButton:hover {
    background-color: rgb(237, 56, 56);
    overflow: visible;
}

.bin path {
    transition: all 0.2s;
}

.deleteButton:hover .bin path {
    fill: #fff;
}

.deleteButton:active {
    transform: scale(0.98);
}

.deleteButton:hover .tooltip {
    opacity: 1;
}
</style>