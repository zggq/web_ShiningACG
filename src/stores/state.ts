import { defineStore } from "pinia";
import { ref } from "vue";
export const useState = defineStore("state", () => {
    let isLoading = ref(true)
    return { isLoading }
})