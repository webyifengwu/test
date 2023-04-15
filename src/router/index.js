import { createRouter, createWebHistory } from 'vue-router'
const Recommend = () => import('../views/Recommend.vue')
const Singer = () => import('../views/Singer.vue')
const TopList = () => import('../views/TopList.vue')
const Search = () => import('../views/Search.vue')
const SingerDetail = () => import("../views/SingerDetail.vue")
const AlbumDetail = ()=>import("../views/AlbumDetail.vue")
const TopListDetail = ()=>import("../views/TopListDetail.vue")
const UserCenter = ()=>import("../views/UserCenter.vue")

const routes = [
  // 首页 也就是推荐页
  {
    path: '/',
    redirect: '/recommend'
  },
  // 推荐页
  {
    path: "/recommend",
    name: "Recommend",
    component: Recommend,
    children:[
      {
        path:':id',
        component:AlbumDetail
      },
    ]
  },
  // 歌手页
  {
    path: "/singer",
    name: "Singer",
    component: Singer,
    children:[
      {
        path:':id',
        component:SingerDetail
      },
    ]
  },
  // 排行榜页
  {
    path: "/topList",
    name: "TopList",
    component: TopList,
    children:[
      {
        path:':id',
        component:TopListDetail
      },
    ]
  },
  // 搜索页
  {
    path: "/search",
    name: "Search",
    component: Search
  },
// 个人页面
  {
    path:"/user",
    name:"User",
    component:UserCenter
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
