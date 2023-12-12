import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
export const getPicture = defineStore('picture', () => {
    const pictureurl = ref('');
    function changePicture(picture: string) {
        pictureurl.value = picture
    }

    return { pictureurl, changePicture }
}, { persist: true })