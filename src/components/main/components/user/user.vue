<template>
    <div class="user-avator-dropdown">
        
        <Dropdown @on-click="handleClick" trigger="click">
            <Avatar :src="userAvator" style="background-color: #87d068" icon="ios-person" />
            <span class="user-name">{{$store.state.user.userName}}</span>
            <Icon :size="18" type="md-arrow-dropdown"></Icon>
            <DropdownMenu slot="list">
                <!-- <DropdownItem name="message">
          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
                </DropdownItem>-->
                <DropdownItem name="updatePassword">修改密码</DropdownItem>
                <DropdownItem name="logout">退出登录</DropdownItem>
            </DropdownMenu>
        </Dropdown>
        <update-modal v-if="modalShow" @changeShow="cancelModal">

        </update-modal>
    </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import updateModal from './update-password'
export default {
    name: 'User',
    props: {
        userAvator: {
            type: String,
            default: ''
        },
        messageUnreadCount: {
            type: Number,
            default: 0
        },
        
    },
    data() {
        return {
            modalShow: false
        }
    },
    components: {
        updateModal
    },
    methods: {
        ...mapActions(['handleLogOut']),
        handleClick(name) {
            switch (name) {
                case 'logout':
                    this.handleLogOut();
                    this.$router.push({
                        name: 'login'
                    })
                    break;
                case 'updatePassword':
                    this.modalShow = true;
                    // console.log(this.modalShow)
                default:
                    break;
            }
            
        },
        cancelModal(data) {
            this.modalShow = data;
        }
    }
}
</script>

<style lang="less" scoped>
.user-name {
    margin-left: 5px;
}
.env {
    margin-right: 10px;
}
</style>
