import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { VERSION } from '@/config';
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload';
import mmToast from '@/base/L2xs-toast';
import Icon from '@/base/L2xs-icon/index';
import '@/utils/axios';
import 'normalize.css/normalize.css';
import '@/assets/styles/index.scss';

// 优化移动端click事件有300ms点击延迟问题
fastclick.attach(document.body)

Vue.config.productionTip = false;
// 全局使用弹出层
Vue.use(mmToast)
// 全局使用 icon 组件
Vue.component(Icon.name, Icon)
// 懒加载配置
Vue.use(VueLazyload, {
  preLoad: 1,
  // error: '@/assets/images/img/default.png',  // 加载错误时
  loading: require('@/assets/images/img/default.png') // 加载中
})


// 访问版本统计(百度统计)
window._hmt && window._hmt.push(['_setCustomVar', 1, 'version', VERSION, 1])

const redirectList = ['/music/details', '/music/comment']
router.beforeEach((to, from, next) => {
  // 百度统计中追踪页面浏览
  window._hmt && to.path && window._hmt.push(['_trackPageview', '/#' + to.fullPath])
  if (redirectList.includes(to.path)) {
    next()
  } else {
    document.title =
      (to.meta.title && `${to.meta.title} - 前端摸鱼塘在线音乐`) || 'L2xs在线音乐'
    next()
  }
})

// 版权信息
window.L2xsPlayer = window.L2xsplayer = `欢迎使用 前端摸鱼塘-在线音乐!
当前版本为：V${VERSION}`
// 控制台打印作者基本信息
console.info(`%c${window.L2xsPlayer}`, `color:red`)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
