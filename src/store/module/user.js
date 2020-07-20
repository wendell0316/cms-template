import { login, logout } from '@/api/user'
import {
    setPassword,
    getPassword,
    setName,
    getName,
    setNick,
    getNick,
    getAccess,
    setAccess,
    getEnv,
    setEnv
} from '@/libs/util'

export default {
    state: {
        userName: getName(),
        userId: '',
        env: getEnv(),
        avatorImgPath: '',
        password: getPassword(),
        access: getAccess(),
        nick: getNick()
    },
    mutations: {
        setUserName(state, name) {
            state.userName = name
            setName(name)
        },
        setNick(state, nick) {
            state.nick = nick
            setNick(nick)
        },
        setAccess(state, access) {
            state.access = access
            setAccess(access)
        },
        setPassword(state, password) {
            state.password = password
            setPassword(password)
        },
        setEnv(state, env) {
            state.env = env
            setEnv(env)
        }
    },
    getters: {
    },
    actions: {
        // 登录
        handleLogin({ commit }, { userName, password }) {
            userName = userName.trim()
            return new Promise((resolve, reject) => {
                login({
                    userName,
                    password
                })
                    .then(res => {
                        const data = res.data.result
                        commit('setPassword', data.password)
                        commit('setEnv', data.env)
                        commit('setUserName', data.name)
                        commit('setNick', data.nick)
                        if (data.admin) {
                            commit('setAccess', ['admin'])
                        } else {
                            commit('setAccess', [])
                        }
                        resolve(res)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        // 退出登录
        handleLogOut({ state, commit }) {
            return new Promise((resolve, reject) => {
                // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
                commit('setPassword', '')
                commit('setAccess', '')
                resolve()
            })
        }
    }
}
