<template>
    <div class>
        <Modal
            @on-cancel="cancel"
            @on-ok="updateUser"
            :loading="sureLoading"
            title="修改密码"
            v-model="updateUserModelShow"
        >
            <Form
                ref="updateUserInfo"
                :label-width="80"
                :model="updateUserInfo"
                :rules="updateRuleValidate"
            >
                <Form-item label="账号">
                    <i-input
                        v-model="updateUserInfo.nick"
                        placeholder="user"
                        type="text"
                        disabled
                    >
                        <Icon slot="prepend" type="ios-person-outline"></Icon>
                    </i-input>
                </Form-item>
                <Form-item label="密码" prop="password">
                    <i-input v-model="updateUserInfo.password" placeholder="password" type="text">
                        <Icon slot="prepend" type="ios-lock-outline"></Icon>
                    </i-input>
                </Form-item>
            </Form>
        </Modal>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    props: {
        modalShow: {
            type: Boolean,
            default: true,
        }
    },
    data() {
        return {
            updateUserModelShow: this.modalShow,
            updateUserInfo: {
                nick: this.$store.state.user.nick,
                password: ''
            },
            updateRuleValidate: {
                password: [{
                    required: true,
                    trigger: 'blur',
                    message: '请输入修改的密码'
                }],
            },
            sureLoading: true,
        }
    },
    components: {

    },
    mounted() {
        // console.log(this.modalShow)
    },
    methods: {
        ...mapActions(['handleLogOut']),
        emptyFormMessage() {
            this.sureLoading = false;
            this.$nextTick(() => {
                this.sureLoading = true;
            })
            this.$Message.warning('请输入表单信息');
        },
        updateUser() {
            if (this.updateUserInfo.password == '') {
                this.emptyFormMessage();
                return;
            }
            const params = {
                password: this.updateUserInfo.password
            }
            updatePassword(params).then(res => {
                if (res.status == 200) {
                    this.$Message.success('修改成功');
                    this.handleLogOut();
                    this.$router.push({
                        name: 'login'
                    })
                    this.cancel();
                }
            })
        },
        cancel() {
            // this.updateUserModelShow = false;
            this.$emit('changeShow', false)
        },
    },
}
</script>

<style scoped lang="less">
</style>
