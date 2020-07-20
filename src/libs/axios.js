import axios from 'axios'
import store from '@/store'
import { Message } from 'view-design'
import router from  '@/router/index'


class HttpRequest {
    constructor(baseUrl = baseURL) {
        this.baseUrl = baseUrl
        this.queue = {}
    }
    getInsideConfig() {
        const config = {
            baseURL: this.baseUrl,
            headers: {
            }
        }
        return config
    }
    destroy(url) {
        delete this.queue[url]
        if (!Object.keys(this.queue).length) {
            // Spin.hide()
        }
    }
    interceptors(instance, url) {
        // 请求拦截
        instance.interceptors.request.use(
            config => {
                if (store.state.user.password) { // 已登录后所有接口加此header
                    config.headers.common['cms-nick'] =
                        store.state.user.nick
                    config.headers.common['cms-password'] =
                        store.state.user.password
                }
                // 添加全局的loading...
                if (!Object.keys(this.queue).length) {
                    // Spin.show() // 不建议开启，因为界面不友好
                }
                this.queue[url] = true
                return config
            },
            error => {
                return Promise.reject(error)
            }
        )
        // 响应拦截
        instance.interceptors.response.use(
            res => {
                this.destroy(url)
                const { data, status } = res
                return { data, status }
            },
            error => {
                this.destroy(url)
                let errorInfo = error.response
                console.log(error);
                if (errorInfo.status == 400 && errorInfo.data.code == 4000) {
                    return Promise.reject({status: 4000})
                }
                if (errorInfo.status == 400 && store.state.user.password) {
                    // Message.error('服务错误，请稍后再试');
                }
                if (errorInfo.status == 401 && store.state.user.password) {
                    Message.error('账号或密码错误，请稍后再试');
                    store.dispatch('handleLogOut')
                    router.replace({
                        name: 'login'
                    })
                } 
                if (errorInfo.status == 400 && !store.state.user.password) {
                    Message.error('账号或密码错误，请稍后再试');
                }
                if (!errorInfo) {
                    const {
                        request: { statusText, status },
                        config
                    } = JSON.parse(JSON.stringify(error))
                    errorInfo = {
                        statusText,
                        status,
                        request: { responseURL: config.url }
                    }
                }
                return Promise.reject(errorInfo)
            }
        )
    }
    request(options) {
        const instance = axios.create()
        options = Object.assign(this.getInsideConfig(), options)
        this.interceptors(instance, options.url)
        return instance(options)
    }
}
export default HttpRequest
