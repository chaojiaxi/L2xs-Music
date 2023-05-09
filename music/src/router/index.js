import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/music',
  },
  {
    path: '/music',
    component: () => import('../views/music'),
    redirect: '/music/playlist',
    children: [
      {
        path: '/music/playlist', // 正在播放
        component: () => import('../views/playList/index'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/music/toplist', // 排行榜列表
        component: () => import('../views/topList/index'),
        meta: {
          title: '排行榜',
          keepAlive: true
        }
      },
      {
        path: '/music/djlist', // 电台
        component: () => import('../views/djList/index'),
        meta: {
          title: '电台',
          keepAlive: true
        }
      },
      {
        path: '/music/mvlist', // MV
        component: () => import('../views/mvList/index'),
        meta: {
          title: 'MV',
          keepAlive: true
        }
      },
      {
        path: '/music/search', // 搜索
        component: () => import('../views/search/index'),
        meta: {
          title: '搜索',
          keepAlive: true
        }
      },
      {
        path: '/music/userlist', // 我的歌单
        component: () => import('../views/userList/index'),
        meta: {
          title: '我的歌单',
          keepAlive: true
        }
      },
      {
        path: '/music/history', // 我听过的列表
        component: () => import('../views/history/index'),
        meta: {
          title: '我听过的'
        }
      },
      {
        path: '/music/personlist', // 个人设置
        component: () => import('../views/personList/index'),
        meta: {
          title: '个人设置',
          keepAlive: true
        }
      },
      {
        path: '/music/details/:id', // 音乐详情列表
        component: () => import('../views/details/musicDetail')
      },
      {
        path: '/music/djdetails/:id', // 音乐详情列表
        component: () => import('../views/details/djDetail')
      },
      {
        path: '/music/comment/:id', // 音乐评论
        component: () => import('../views/comment/index'),
        meta: {
          title: '评论详情'
        }
      }
    ]
  }
]

const router = new VueRouter({
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
  routes
})

export default router
