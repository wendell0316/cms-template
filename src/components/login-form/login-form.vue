<template>
    <Form
        :model="form"
        :rules="rules"
        @keydown.enter.native="handleSubmit"
        ref="loginForm"
    >
        <FormItem prop="userName">
            <Input
                placeholder="请输入账号"
                v-model="form.userName"
            >
                <span slot="prepend">
                    <Icon
                        :size="16"
                        type="ios-person"
                    ></Icon>
                </span>
            </Input>
        </FormItem>
        <FormItem prop="password">
            <Input
                placeholder="请输入工号或项目唯一标识"
                type="password"
                v-model="form.password"
            >
                <span slot="prepend">
                    <Icon
                        :size="14"
                        type="md-lock"
                    ></Icon>
                </span>
            </Input>
        </FormItem>
        <FormItem>
            <Button
                @click="handleSubmit"
                long
                type="primary"
            >登录</Button>
        </FormItem>
    </Form>
</template>
<script>
export default {
    name: 'LoginForm',
    props: {
        userNameRules: {
            type: Array,
            default: () => {
                return [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ];
            }
        },
        passwordRules: {
            type: Array,
            default: () => {
                return [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ];
            }
        }
    },
    data() {
        return {
            form: {
                userName: '',
                password: ''
            }
        };
    },
    computed: {
        rules() {
            return {
                userName: this.userNameRules,
                password: this.passwordRules
            };
        }
    },
    methods: {
        handleSubmit() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.$emit('on-success-valid', {
                        userName: this.form.userName,
                        password: this.form.password
                    });
                }
            });
        }
    }
};
</script>
