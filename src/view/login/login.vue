<style lang="less">
@import './login.less';
</style>

<template>
    <div class="login">
        <div class="text-magic" data-word="同程旅行">
            <div class="white"></div>
        </div>
        <div class="login-con">
            <Card :bordered="false" icon="log-in" title="欢迎登录">
                <div class="form-con">
                    <login-form @on-success-valid="handleSubmit"></login-form>
                    <p class="login-tip">
                        本系统不支持个人注册
                        <br />如有需求请联系管理员处理
                    </p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import LoginForm from '_c/login-form';
import { mapActions } from 'vuex';
export default {
    components: {
        LoginForm
    },
    methods: {
        ...mapActions(['handleLogin']),
        handleSubmit({ userName, password }) {
            this.handleLogin({ userName, password }).then(res => {
                if (res.status == 200) {
                    this.$router.push({
                        name: this.$config.homeName
                    });
                } else {
                    this.$Message.error('登录失败')
                }

            });
        }
    }
};
</script>

<style>
</style>
