// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import iView from 'view-design';
import config from '@/config';
import './index.less';
import '@/assets/icons/iconfont.css';

Vue.use(iView, {
    //   i18n: (key, value) => i18n.t(key, value)
});

Vue.config.productionTip = false;
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config;

new Vue({
    el: '#app',
    router,
    store,
    render: (h) => h(App),
});
