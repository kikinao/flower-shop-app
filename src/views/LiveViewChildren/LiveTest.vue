<template>
    <div class="wrapper" id="wrapper">
        <ul class="content" id="content">
            <li class="item" v-for="(item, index) in list" :key="index">
                <p>
                    {{ item }}
                </p>
            </li>
        </ul>
    </div>
</template>

<script>
import { nextTick, onMounted, onUnmounted, reactive, toRefs } from "vue";
import BScroll from "better-scroll";

export default {
    name: "Home",

    setup(props) {
        const state = reactive({
            isShow: false,
            list: [],
            scroll: null,
            form: {
                page: 1,
            },
        });

        let time0 = 0;
        let timer = null;

        onMounted(async () => {
            //获取商品列表
            // console.log(data);
            state.list = [1,2,3,4,5,6,7,8,9,0,0,57,6574,35,3546,1,123,123,123,123,123,213,1232,132,1312,32,1123,23,123,1231,23,1231,32,1123,32,1123,31,1231,123,123123,123]
            state.scroll = new BScroll(".wrapper", {
                probeType: 3, //实时获取滚动坐标位置
                scrollY: true,
                click: true,
            });
            // 监听滚动时的返回
            state.scroll.on("scroll", debounce(onScroll, 50));
            nextTick(() => {
                state.scroll.refresh();
            });
        });

        onUnmounted(() => {
            if (timer) clearTimeout(timer);
        });

        // 节流函数
        function debounce(func, delay) {
            let time1 = Date.now();
            if (time1 - time0 > delay) {
                time0 = time1;
                return function (...args) {
                    if (timer) clearTimeout(timer);
                    timer = setTimeout(() => {
                        func.apply(this, args);
                    }, delay);
                };
            }
        }

        // 返回顶部
        function goTop() {
            state.scroll.scrollTo(0, 0, 500)
        }

        // 滚动加载事件
        const onScroll = async (position) => {
            let h1 = document.querySelector("#content").clientHeight;
            let h = document.querySelector("#wrapper").clientHeight;
            console.log(position.y);
            if (position.y < -500) {
                state.isShow = true
            }
            if (position.y > -500) {
                state.isShow = false
            }
            if (position.y <= h - h1 + 200) {
                // 加载下一页
                console.log("next_page");
                state.form.page += 1;
                let data = await getGoods(state.form);
                state.list = [...state.list, ...data.data.goods.data];
            }
            if (position.y >= 50) {
                // 刷新
                console.log("clear");
                state.form.page = 1;
                let data = await getGoods(state.form);
                state.list = data.data.goods.data;
            }

            nextTick(() => {
                state.scroll.refresh();
            });
        };

        return {
            ...toRefs(state),
            goTop
        };
    },
};
</script>
