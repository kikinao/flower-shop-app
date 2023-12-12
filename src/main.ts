import './assets/base.scss';

import './assets/fontIcon/iconfont.css'
import './assets/fontIcon2/iconfont.css'
import 'amfe-flexible' // rem 布局适配

// 引入vant所需样式
// Toast
import 'vant/es/Toast/style';
// Dialog
import 'vant/es/dialog/style';
// Notify
import 'vant/es/notify/style';
// ImagePreview
import 'vant/es/image-preview/style';
import { VueMasonryPlugin } from 'vue-masonry';
import { Lazyload } from 'vant';



import { createApp } from 'vue';

// 引入pinia
// import { createPinia } from 'pinia'
import pinia from './stores/store';
import App from './App.vue'
import router from './router'
import 'amfe-flexible' // rem 布局适配

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(VueMasonryPlugin);

app.use(Lazyload, {
    lazyComponent: true,
});

app.mount('#app')
