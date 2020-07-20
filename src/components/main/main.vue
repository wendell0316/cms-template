<template>
    <Layout
        class="main"
        style="height: 100%"
    >
        <Sider
            :collapsed-width="64"
            :style="{overflow: 'hidden'}"
            :width="256"
            class="left-sider"
            collapsible
            hide-trigger
            v-model="collapsed"
        >
            <side-menu
                :active-name="$route.name"
                :collapsed="collapsed"
                :menu-list="menuList"
                @on-select="turnToPage"
                accordion
                ref="sideMenu"
            >
                <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
                <div class="logo-con">
                    <Button class="env-center" size="large" shape="circle" v-show="!collapsed" type="primary" icon="md-card">{{$store.state.user.env}}环境</Button>
                    <button class="min-env" v-show="collapsed">{{$store.state.user.env}}</button>
                </div>
            </side-menu>
        </Sider>
        <Layout>
            <Header class="header-con">
                <header-bar
                    :collapsed="collapsed"
                    @on-coll-change="handleCollapsedChange"
                >
                    <user
                        :message-unread-count="unreadCount"
                        :user-avator="userAvator"
                    />
                    <fullscreen
                        style="margin-right: 10px;"
                        v-model="isFullscreen"
                    />
                </header-bar>
            </Header>
            <Content class="main-content-con">
                <Layout class="main-layout-con">
                    <!-- <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
                    </div>-->
                    <Content class="content-wrapper">
                        <keep-alive :include="cacheList">
                            <router-view />
                        </keep-alive>
                        <ABackTop
                            :bottom="80"
                            :height="100"
                            :right="50"
                            container=".content-wrapper"
                        ></ABackTop>
                    </Content>
                </Layout>
            </Content>
        </Layout>
    </Layout>
</template>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import User from './components/user'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { routeEqual } from '@/libs/util' // getNewTagList
import routers from '@/router/routers'
import './main.less'
export default {
    name: 'Main',
    components: {
        SideMenu,
        HeaderBar,
        Fullscreen,
        User,
        ABackTop
    },
    data() {
        return {
            collapsed: false,
            isFullscreen: false
        }
    },
    computed: {
        tagNavList() {
            return this.$store.state.app.tagNavList
        },
        userAvator() {
            return this.$store.state.user.avatorImgPath
        },
        cacheList() {
            const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
            return list
        },
        menuList() {
            return this.$store.getters.menuList
        },
        local() {
            return this.$store.state.app.local
        },
        hasReadErrorPage() {
            return this.$store.state.app.hasReadErrorPage
        },
        unreadCount() {
            return this.$store.state.user.unreadCount
        }
    },
    methods: {
        ...mapMutations([
            'setBreadCrumb',
            // 'setTagNavList',
            // 'addTag',
            'setLocal',
            'setHomeRoute',
            'closeTag'
        ]),
        ...mapActions([
            'handleLogin',
        ]),
        turnToPage(route) {
            // this.$refs.sideMenu.updateOpenName(route.name)
            let { name, params, query } = {}
            if (typeof route === 'string') name = route
            else {
                name = route.name
                params = route.params
                query = route.query
            }
            if (name.indexOf('isTurnByHref_') > -1) {
                window.open(name.split('_')[1])
                return
            }
            this.$router.push({
                name,
                params,
                query
            })
        },
        handleCollapsedChange(state) {
            this.collapsed = state
        },
    },
    watch: {
        '$route'(newRoute) {
            const { name, query, params, meta } = newRoute
            // this.addTag({
            //     route: { name, query, params, meta },
            //     type: 'push'
            // })
            this.setBreadCrumb(newRoute)
            // this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
            this.$refs.sideMenu.updateOpenName(newRoute.name)
        }
    },
    mounted() {
        /**
         * @description 初始化设置面包屑导航和标签导航
         */
        // this.setTagNavList()
        this.setHomeRoute(routers)
        const { name, params, query, meta } = this.$route
        // this.addTag({
        //     route: { name, params, query, meta }
        // })
        // this.$refs.sideMenu.updateOpenName('clause')
        this.setBreadCrumb(this.$route)
        // 如果当前打开页面不在标签栏中，跳到homeName页
        // if (!this.tagNavList.find(item => item.name === this.$route.name)) {
        //     this.$router.push({
        //         name: this.$config.homeName
        //     })
        // }
        // 获取未读消息条数
        // this.getUnreadMessageCount()
    }
}
</script>
