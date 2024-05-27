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
                <!-- <button v-if="props.user.username == vm.details.recipe?.author" v-on:click="editRecipe" class="Btn">Edit
                    <svg class="svg" viewBox="0 0 512 512">
                        <path
                        d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z">
                    </path>
                </svg>
            </button> -->
            </h3>
            <Button class="w-auto" v-if="props.user.username == vm.details.recipe?.author"
                v-on:click="editRecipe">Edit</Button>
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