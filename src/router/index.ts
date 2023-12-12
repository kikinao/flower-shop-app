import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CollectionView from '../views/CollectionView.vue'
import LoginVire from '../views/AuthorizationViewChildren/LoginVire.vue'
import RegisterView from '../views/AuthorizationViewChildren/RegisterView.vue'
import ShopView from '../views/ShopView.vue'
import UserView from '../views/UserView.vue'
import LiveView from '../views/LiveView.vue'
import SearchView from '../views/SearchView.vue'
import HomePage from '../views/UserViewChildren/HomePage.vue'
import LivePlaybackView from '../views/LiveViewChildren/LivePlaybackView.vue'
import LivingView from '../views/LiveViewChildren/LivingView.vue'
import PayView from '../views/PayView.vue'
import PaySuccess from '../views/PaySuccess.vue'
import LiveRoomView from '../views/LiveViewChildren/LiveRoomView.vue'
import LiveTest from '../views/LiveViewChildren/LiveTest.vue'
import HomeChildView from '../views/HomeChildView/HomeChildView.vue'
import ConfirmOrder from '../views/ShopViewChildren/ConfirmOrder.vue'
import AddressManagement from '../views/AddressManagement.vue'
import LocationView from '../views/AddressManagementChildren/LocationView.vue'
import ModuleHome from '../views/HomeChildView/ModuleHome.vue'
import attentionData from '../views/UserViewChildren/attentionData.vue'
import MyOrderList from "../views/UserViewChildren/MyOrderList.vue"


// 在路由中引入pinia
import pinia from '../stores/store'
import AuthorizationView from '../views/AuthorizationView.vue'
import { useRouterNameStore } from "../stores/counter";
const store = useRouterNameStore(pinia);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        keepAlive: true //设置页面是否需要使用缓存
      },
      children: [
        {
          path: '/',
          name: 'homechild',
          component: HomeChildView,
          meta: {
            keepAlive: true //设置页面是否需要使用缓存
          },
        }
      ]
    },
    {
      path: '/collection',
      name: 'collection',
      component: CollectionView
    },
    {
      path: '/shop',
      name: 'shop',
      component: ShopView,
      children: [
        {
          path: 'confirmorder',
          name: 'confirmorder',
          component: ConfirmOrder,
        },
      ]
    },
    {
      path: '/user',
      name: 'user',
      component: UserView,
      meta: {
        keepAlive: true //设置页面是否需要使用缓存
      },
      children: [
        {
          path: 'homepage',
          name: 'homepage',
          component: HomePage,
        }
      ]
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView
    },
    {
      path: '/live',
      name: 'live',
      component: LiveView,
      meta: {
        keepAlive: true //设置页面是否需要使用缓存
      },
    },
    {
      path: '/liveroom',
      name: 'liveroom',
      component: LiveRoomView,
    },
    {
      path: '/livePlayback:itemUrlId&:actorUrlId&:explainId',
      name: 'livePlayback',
      props: true,
      component: LivePlaybackView,
    },
    {
      path: '/living',
      name: 'living',
      component: LivingView,
    },
    {
      path: '/authorization',
      name: 'authorization',
      component: AuthorizationView,
      redirect: { name: 'login' },
      children: [
        {
          path: 'login',
          name: 'login',
          component: LoginVire
        },
        {
          path: 'register',
          name: 'register',
          component: RegisterView
        }
      ]
    },
    {
      path: '/pay',
      name: 'pay',
      component: PayView
    },
    {
      path: '/pay-success',
      name: 'paySuccess',
      component: PaySuccess
    },
    {
      path: '/product-list',
      name: "productList",
      component: () => import("../views/SearchViewChildren/ProductListPageView.vue")
    },
    {
      path: '/livetest',
      name: 'livetest',
      component: LiveTest,
    },
    {
      path: '/address-anagement',
      name: "addressmanagement",
      component: AddressManagement,
      children: [
        {
          path: 'location',
          name: 'location',
          component: LocationView,
        }
      ]
    },
    {
      path: '/moduleHome',
      name: "moduleHome",
      component: ModuleHome
    }, {
      path: '/project-detail',
      name: "project-detail",
      component: () => import("../views/ProductDetailsView.vue")
    },
    {
      path: '/attention',
      name: 'attention',
      component: attentionData,
    },
    {
      path: '/myorder',
      name: 'myorder',
      component: MyOrderList
    }
  ]
})

//全局路由守卫
router.beforeEach((to) => {

  const { name } = to;
  // console.log(to.name)
  // console.log(store.fromName)

  if (name == 'collection' || name == 'user' || name == 'shop') {

    store.changeFromName(name as string);

    const token = localStorage.token;

    if (token) {
      return true;
    } else {
      return { name: 'authorization' }
    }
    return { name: 'authorization' }

  } else {
    return true;
  }
})

export default router


