<script setup>

import { onMounted, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from './Button.vue';

const route = useRoute()
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

defineOptions({
    inheritAttrs: false
})

const vm = reactive({
    details: {}
})

onMounted(() => {
    fetch(`${props.apiUrl}/recipe?id=${route.params.id}`)
        .then(resp => resp.json())
        .then(apiObj => {
            if (apiObj && apiObj.data) {
                vm.details = apiObj.data;
            } else {
                alert(apiObj.error?.message)
            }
        })
})

function editRecipe() {
    router.push(`/editRecipe/${vm.details.recipe?.id}`)
}

</script>

<template>
    <div class="mx-4 mx-md-auto container-div">
        <div class="row">
            <h3>{{ vm.details.recipe?.name }} 
                <Button class="w-auto" v-if="props.user.username == vm.details.recipe?.author"
                v-on:click="editRecipe">Edit</Button>
            </h3>            
            <div style="max-width: 50%; max-height: 50%;">
                <img v-if="vm.details.recipe?.image"
                    style="width: 100%; height: 100%"
                    :src="`${props.apiUrl}/recipePicture/${vm.details.recipe?.image}`"></img>
            </div>
            <div style="font-style: italic;">by {{ vm.details.recipe?.author }}</div>
            <div>Difficulty: {{ vm.details.recipe?.difficulty }}/5</div>
            <div>Prep Time: {{ vm.details.recipe?.preptime }}</div>
            <div>Categories: {{ vm.details.recipe?.categories?.map(o => o.name).join(", ") }}</div>
        </div>

        <div class="row">
            <div v-for="(i, index) in vm.details.ingredientSets">
                <h4>Ingredient Set {{ index + 1 }}</h4>
                <ul>
                    <li v-for="x in JSON.parse(i.ingredients)">{{ x }}</li>
                </ul>
            </div>
        </div>

        <div class="row">
            <div v-for="(i, index) in vm.details.stepSets">
                <h4>Step Set {{ index + 1 }}</h4>
                <ul>
                    <li v-for="x in JSON.parse(i.steps)">{{ x }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container-div {
    @media (min-width: 768px) {
        width: 50%
    }
}

/* .Btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 50%;
    height: 20px;
    border: none;
    padding: 0px 10px;
    background-color: rgb(168, 38, 255);
    color: white;
    font-weight: 500;
    font-size: small;
    cursor: pointer;
    border-radius: 10px;
    box-shadow: 5px 5px 0px rgb(140, 32, 212);
    transition-duration: .3s;
}

.svg {
    width: 8px;
    position: absolute;
    right: 0;
    margin-right: 5px;
    fill: white;
    transition-duration: .3s;
}

.Btn:hover {
    color: transparent;
}

.Btn:hover svg {
    right: 43%;
    margin: 0;
    padding: 0;
    border: none;
    transition-duration: .3s;
}

.Btn:active {
    transform: translate(3px, 3px);
    transition-duration: .3s;
    box-shadow: 2px 2px 0px rgb(140, 32, 212);
} */
</style>