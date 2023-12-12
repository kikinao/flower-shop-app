import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const getAddress = defineStore('address', () => {
    const name = ref('');
    const tel = ref('');
    const address = ref('')
    const id = ref('')
    function changAdsdress(userid: string) {
        address.value = userid;
    }
    return { name, tel, address, id, changAdsdress }
}, { persist: true })