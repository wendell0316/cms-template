<template>
    <div>
        <card>
            <tables
                :columns="columns"
                @delete="handleDelete"
                editable
                ref="tables"
                search-place="top"
                searchable
                v-model="userList"
                @onClickRightBtn="isShowModal"
                rightHead="添加用户"
                :selectOptions="[{key: 'nick', title: '用户账号'}, {key: 'name', title: '用户名称'}]"
            />
        </card>
        <Modal
            @on-cancel="cancel"
            @on-ok="handleAdd"
            :loading="sureLoading"
            title="添加用户"
            v-model="modalShow"
        >
            <Form
                ref="formItem"
                :label-width="80"
                :model="formItem"
                :rules="ruleValidate"
            >
                <Form-item
                    label="用户账号"
                    prop="nick"
                >
                    <i-input
                        v-model="formItem.nick"
                        placeholder="账号"
                        type="text"
                    >
                        <Icon
                            slot="prepend"
                            type="ios-at-outline"
                        ></Icon>
                    </i-input>
                </Form-item>
                <Form-item
                    label="用户名称"
                    prop="name"
                >
                    <i-input
                        v-model="formItem.name"
                        placeholder="name"
                        type="text"
                    >
                        <Icon
                            slot="prepend"
                            type="ios-person-outline"
                        ></Icon>
                    </i-input>
                </Form-item>
                <Form-item
                    label="密码"
                    prop="password"
                >
                    <i-input
                        v-model="formItem.password"
                        placeholder="password"
                        type="text"
                    >
                        <Icon
                            slot="prepend"
                            type="ios-lock-outline"
                        ></Icon>
                    </i-input>
                </Form-item>
                <Form-item
                    label="描述"
                    prop="desc"
                >
                    <i-input
                        v-model="formItem.desc"
                        placeholder="desc"
                        type="text"
                    >
                        <Icon
                            slot="prepend"
                            type="ios-lock-outline"
                        ></Icon>
                    </i-input>
                </Form-item>
                <Form-item label="管理员">
                    <i-switch
                        v-model="formItem.admin"
                        size="large"
                    >
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </Form-item>
            </Form>
        </Modal>
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
                :rules="ruleValidate"
            >
                <Form-item label="账号">
                    <i-input
                        v-model="updateUserInfo.nick"
                        placeholder="user"
                        type="text"
                        disabled
                    >
                        <Icon
                            slot="prepend"
                            type="ios-person-outline"
                        ></Icon>
                    </i-input>
                </Form-item>
                <Form-item
                    label="密码"
                    prop="password"
                >
                    <i-input
                        v-model="updateUserInfo.password"
                        placeholder="password"
                        type="text"
                    >
                        <Icon
                            slot="prepend"
                            type="ios-lock-outline"
                        ></Icon>
                    </i-input>
                </Form-item>
            </Form>
        </Modal>
    </div>
</template>

<script>
import { getUserList, addAdmin, addUser, deleteUser, updatePassword } from '@/api/user';
import { mapActions } from 'vuex';
import Tables from '_c/tables';
export default {
    name: 'permissions-manage',
    data() {
        const userValid = (rule, value, callback) => {
            if (this.userList.map(x => x.user).includes(value)) {
                callback(new Error('该名称已被使用'));
            } else {
                callback();
            }
        };
        return {
            columns: [
                {
                    title: '用户账号',
                    key: 'nick'
                },
                {
                    title: '用户名称',
                    key: 'name'
                },
                {
                    title: '管理员',
                    key: 'admin',
                    width: 120,
                    render: (h, params) => {
                        return h('div', [
                            h(
                                'Button',
                                {
                                    props: {
                                        type: params.row.admin ? 'success' : 'warning',
                                        size: 'small'
                                    }
                                },
                                [
                                    h(
                                        'Poptip',
                                        {
                                            props: {
                                                confirm: true,
                                                title: `你确定要更换改角色为${
                                                    params.row.admin ? '普通用户' : '管理员'
                                                }吗?`
                                            },
                                            on: {
                                                'on-ok': () => {
                                                    this.addManage(params.row);
                                                }
                                            }
                                        },
                                        params.row.admin ? '是' : '否'
                                    )
                                ]
                            )
                        ]);
                    }
                },
                {
                    title: '创建时间',
                    render: (h, params) => {
                        return h('div', new Date(params.row.ca).format('yyyy-MM-dd hh:mm:ss'));
                    }
                },
                {
                    title: '描述',
                    key: 'desc'
                },
                {
                    title: '操作',
                    key: 'caozuo',
                    width: 150,
                    render: (h, params) => {
                        return h('div', [
                            // h(
                            //     'Button',
                            //     {
                            //         props: {
                            //             type: 'warning',
                            //             size: 'small'
                            //         },
                            //         on: {
                            //             click: () => {
                            //                 this.updateUserModelShow = true;
                            //                 this.updateUserInfo.userName = params.row.user;
                            //             }
                            //         }
                            //     },
                            //     '修改'
                            // ),
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginLeft: '10px'
                                    }
                                },
                                [
                                    h(
                                        'Poptip',
                                        {
                                            props: {
                                                confirm: true,
                                                title: `你确定要删除吗?`
                                            },
                                            on: {
                                                'on-ok': () => {
                                                    this.handleDelete(params.row);
                                                }
                                            }
                                        },
                                        '删除'
                                    )
                                ]
                            )
                        ]);
                    }
                }
            ],
            userList: [],
            modalShow: false,
            formItem: {
                // 添加用户信息
                name: '',
                desc: '',
                password: '',
                admin: false,
                nick: ''
            },
            ruleValidate: {
                nick: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请输入账号'
                    },
                    {
                        pattern: /^[0-9a-zA-Z_]+$/,
                        message: '账号只能包含数字字母及下划线',
                        trigger: 'change'
                    }
                ],
                name: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请输入用户名或项目名'
                    },
                    {
                        validator: userValid,
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请输入密码'
                    }
                ],
                desc: {
                    required: true,
                    trigger: 'blur',
                    message: '请输入标识'
                }
            },
            sureLoading: true,
            updateUserModelShow: false,
            updateUserInfo: {
                userName: '',
                password: ''
            }
        };
    },
    components: {
        Tables
    },
    mounted() {
        this.getList();
    },
    methods: {
        ...mapActions(['handleLogOut']),

        handleDelete(data) {
            const params = {
                nick: data.nick
            };
            deleteUser(params).then(res => {
                if (res.status == 200) {
                    this.$Message.success('删除成功');
                    this.userList.splice(data._index, 1);
                } else {
                    this.$Message.warning('删除失败，请稍后再试');
                }
            });
        },
        addManage(data) {
            const params = {
                nick: data.nick,
                admin: !data.admin
            };
            addAdmin(params).then(res => {
                if (res.status == 200) {
                    this.getList();
                } else {
                    this.$Message.warning('修改管理员失败');
                }
            });
        },
        getList() {
            getUserList().then(res => {
                res.data.result.map(x => {
                    x.createAt = new Date(x.createAt).format('yyyy-MM-dd hh:mm:ss');
                });
                this.userList = res.data.result;
            });
        },
        isShowModal(data) {
            this.modalShow = true;
        },
        cancel() {
            this.modalShow = false;
        },
        emptyFormMessage() {
            this.sureLoading = false;
            this.$nextTick(() => {
                this.sureLoading = true;
            });
            this.$Message.warning('请输入表单信息');
        },
        async handleAdd() {
            const isValid = await this.$refs['formItem'].validate();
            if (
                this.formItem.user == '' ||
                this.formItem.desc == '' ||
                this.formItem.password == ''
            ) {
                this.emptyFormMessage();
                return;
            }
            if (!isValid) {
                this.$Message.warning('请输入合法信息');
                return;
            }
            // const data = this.formItem;

            addUser(this.formItem).then(res => {
                if (res.status == 200) {
                    this.getList();
                    this.$Message.success('添加成功');
                    this.modalShow = false;
                }
            });
        },
        updateUser() {
            if (this.updateUserInfo.password == '') {
                this.emptyFormMessage();
                return;
            }
            const params = {
                user: this.updateUserInfo.userName,
                newPassword: this.updateUserInfo.password
            };
            updatePassword(params).then(res => {
                if (res.status == 200) {
                    this.$Message.success('修改成功');
                    if (this.$store.state.user.userName == this.updateUserInfo.userName) {
                        this.handleLogOut();
                        this.$router.push({
                            name: 'login'
                        });
                    }
                    this.updateUserModelShow = false;
                }
            });
        },
        changeIndex(index1, index2) {
            this.userList.splice(index2,1,...this.userList.splice(index1, 1 , this.userList[index2]));
        }
    }
};
</script>

<style lang="less" scoped>
.qq-group-img {
    display: block;
    margin: 0 auto;
    width: 240px;
}
.qq-group-intro {
    padding: 20px;
    font-size: 16px;
}
/deep/.ivu-table-wrapper {
    overflow: inherit;
    .ivu-poptip-inner {
        color: #555;
        i {
            left: 17px;
        }
    }
}
</style>
