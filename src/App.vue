<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { Image as VanImage } from 'vant';
import homeSrc from './assets/icons/logo.svg';
import liveSrc from './assets/icons/live.svg';
import attentionSrc from './assets/icons/attention.svg';
import shopSrc from './assets/icons/shopCar.svg';
import mySrc from './assets/icons/my.svg';
</script>

<template>
  <div class="head">
    <div class="nav">
      <RouterLink :to="{ name: 'homechild' }" v-slot="{ navigate, isActive, isExactActive }" custom>

        <div @click="navigate" :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']">

          <van-image width="22" height="22" :src="homeSrc" />

          <span class="nav-title">首页</span>
        </div>
      </RouterLink>
      <RouterLink :to="{ name: 'collection' }" v-slot="{ navigate, isActive, isExactActive }" custom>

        <div @click="navigate" :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']">

          <van-image width="22" height="22" :src="attentionSrc" />

          <span class="nav-title">收藏</span>
        </div>
      </RouterLink>
      <RouterLink :to="{ name: 'live' }" v-slot="{ navigate, isActive, isExactActive }" custom>

        <div @click="navigate"
          :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active', 'live']">

          <van-image width="27" height="27" :src="liveSrc" />

          <span class="nav-title">直播</span>
        </div>
      </RouterLink>
      <RouterLink :to="{ name: 'shop' }" v-slot="{ navigate, isActive, isExactActive }" custom>

        <div @click="navigate"
          :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active', 'shopCar']">

          <van-image width="22" height="22" :src="shopSrc" />

          <span class="nav-title">购物车</span>
        </div>
      </RouterLink>
      <RouterLink :to="{ name: 'user' }" v-slot="{ navigate, isActive, isExactActive }" custom>

        <div @click="navigate"
          :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active', 'my']">

          <van-image width="22" height="22" :src="mySrc" />

          <span class="nav-title">我的</span>
        </div>
      </RouterLink>
    </div>
  </div>
  <div>
    <router-view v-slot="{ Component }" >
      <keep-alive>
        <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
      </keep-alive>
      <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
    </router-view>
    <!-- <RouterView /> -->
  </div>
</template>

<style lang="scss" scoped>
.nav {
  font-size: 12px;
  padding: 0 40px;
  height: 55px;
  text-align: center;

  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background-color: white;

  display: flex;
  justify-content: space-between;
  align-items: center;

  z-index: 10;

  .router-link-active {
    position: relative;
    // color: var(--subject-color);

    &::after {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background-color: var(--subject-color);

      position: absolute;
      right: -7px;
      top: 0px;
    }
  }

  .nav-title {
    display: block;
    margin-top: 5px;
  }

  .router-link-active.live {
    position: relative;

    &::after {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background-color: var(--subject-color);

      position: absolute;
      right: -10px;
      top: 0px;
    }
  }

  .router-link-active.shopCar {
    position: relative;

    &::after {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background-color: var(--subject-color);

      position: absolute;
      right: 0px;
      top: 0px;
    }
  }

  .router-link-active.my {
    position: relative;

    &::after {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background-color: var(--subject-color);

      position: absolute;
      right: -3px;
      top: 0px;
    }
  }
}
</style>
