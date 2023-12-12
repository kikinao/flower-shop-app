<template>
    <div class="item-group">
        <img :src="props.img">
        <div v-if="props.leftbottom_taglist.length != 0" class="title">
            <span class="advertising">广告</span>
            <span>{{ props.title }}</span>
        </div>
        <div v-else class="title">
            <span>{{ props.title }}</span>
        </div>
        <div class="price-group">
            <span class="price">¥{{ props.price }}</span>
            <span>{{ props.cfav }} <van-icon name="star-o" /></span>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps(["tradeItemId", "img", "title", "leftbottom_taglist", "cfav", "price"]);

</script>

<style scoped lang="scss">
.item-group {
    width: 47vw;
    font-size: 12.48px;
    color: #333;
    background-color: #fff;
    border-radius: 10px;
    margin-bottom: 10px;
    overflow: hidden;

    img {
        width: 100%;
        height: 63vw;
    }

    .title {
        padding: 5px 5px 0;
        line-height: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;

        .advertising {
            padding: 3px;
            background-color: #fafafa;
            color: #c2c2c2;
            margin-right: 5px;
        }
    }

    .price-group {
        display: flex;
        padding: 10px 10px 5px;
        justify-content: space-between;
        align-items: center;
        font-size: 10px;
        font-weight: bold;
        color: var(--subject-color);

        .price {
            font-size: 16px;
            color: #000;
        }
    }
}
</style>