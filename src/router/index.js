import Vue from 'vue';
import Router from 'vue-router';
import routes from './routers';
import store from '@/store';
import { mapMutations } from 'vuex';
import iView from 'view-design';
import { setToken, getPassword, canTurnTo, setTitle } from '@/libs/util';
import config from '@/config';
import '@/libs/dateUtils.js';
import beforeClose from './before-close';
const { homeName, filePrefix, basePath } = config;

Vue.use(Router);
const router = new Router({
    base: basePath,
    routes,
    mode: 'history',
});
store.state.app.filePrefix = filePrefix;

const LOGIN_PAGE_NAME = 'login';

const turnTo = (to, access, next) => {
    if (canTurnTo(to.name, access, routes)) next();
    // 有权限，可访问
    else {
        next({ replace: true, name: 'product_manage' });
    }
};

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    const password = getPassword();
    if (!password && to.name !== LOGIN_PAGE_NAME) {
        // 未登录且要跳转的页面不是登录页
        next({
            name: LOGIN_PAGE_NAME, // 跳转到登录页
        });
    } else if (!password && to.name === LOGIN_PAGE_NAME) {
        // 未登陆且要跳转的页面是登录页
        store.state.app.contentChanged = false;
        store.state.app.publishChanged = false;
        next(); // 跳转
    } else if (store.state.app.contentChanged) {
        beforeClose.before_close_normal_change((res) => {
            if (res) {
                next();
                store.state.app.contentChanged = false;
            } else {
                store.state.app.contentChanged = true;
                next(false);
                iView.LoadingBar.finish();
            }
        });
    } else if (store.state.app.publishChanged) {
        beforeClose.before_close_normal_publish((res) => {
            if (res) {
                next();
                store.state.app.publishChanged = false;
            } else {
                store.state.app.publishChanged = true;
                next(false);
                iView.LoadingBar.finish();
            }
        });
    } else if (!password && to.name === LOGIN_PAGE_NAME) {
        // 未登陆且要跳转的页面是登录页
        next(); // 跳转
    } else if (password && to.name === LOGIN_PAGE_NAME) {
        // 已登录且要跳转的页面是登录页
        next({
            name: homeName, // 跳转到homeName页
        });
    } else if (password && to.name === homeName) {
        // 已登录且要跳转的页面是登录页
        if (canTurnTo(to.name, store.state.user.access, routes)) {
            next({
                name: homeName, // 跳转到homeName页
            });
        } else {
            next({
                name: 'error_401', // 跳转到错误页 （在无权跳转首页时，可在此配置该权限人员可跳转的页面）
            });
        }
    } else {
        turnTo(to, store.state.user.access, next);
    }
});

router.afterEach((to) => {
    setTitle(to, router.app);
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

export default router;
