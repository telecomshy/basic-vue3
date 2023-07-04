<template>
    <the-main>
    </the-main>
</template>

<script setup lang="ts">
import TheMain from "@/views/layout/TheMain.vue";

// import {ref, reactive, isReactive, isRef} from "vue";
//
//
// const obj = reactive({})
// const telecomshy = ref({name: "telecomshy"})
// obj.name= telecomshy
//
// console.log(obj)
// console.log(isRef(obj.name))
// console.log(isReactive(obj.name))
// console.log(obj.name)
// console.log(JSON.stringify(obj))
//
// console.log("==========================================")
// const obj2 = reactive({obj: {name: "shl"}})
// console.log(obj2)
// console.log(isRef(obj2.obj))
// console.log(isReactive(obj2.obj))
// console.log(obj2.obj)
// console.log(JSON.stringify(obj2))

// function createGetter(isReadonly2 = false, shallow = false) {
//     return function get2(target, key, receiver) {
//         if (key === "__v_isReactive") {
//             return !isReadonly2;
//         } else if (key === "__v_isReadonly") {
//             return isReadonly2;
//         } else if (key === "__v_isShallow") {
//             return shallow;
//         } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
//             return target;
//         }
//         const targetIsArray = isArray(target);
//         if (!isReadonly2) {
//             if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
//                 return Reflect.get(arrayInstrumentations, key, receiver);
//             }
//             if (key === "hasOwnProperty") {
//                 return hasOwnProperty;
//             }
//         }
//         const res = Reflect.get(target, key, receiver);
//         if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
//             return res;
//         }
//         if (!isReadonly2) {
//             track(target, "get", key);
//         }
//         if (shallow) {
//             return res;
//         }
//         if (isRef(res)) {
//             return targetIsArray && isIntegerKey(key) ? res : res.value;
//         }
//         if (isObject(res)) {
//             return isReadonly2 ? readonly(res) : reactive(res);
//         }
//         return res;
//     };
// }
</script>

<style scoped>

</style>
