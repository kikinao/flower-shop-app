<template>
    <div class="curLoginBox">
        <div class="inputBox">
            <van-cell-group inset class="myInputGroup">
                <van-form>
                    <van-field v-model="userName" left-icon="phone-o" placeholder="请输入手机号"
                        :rules="[{ pattern, message: '手机号格式不正确' }]" />
                    <van-field v-model="userPaw" center type="password" left-icon="edit" placeholder="请输入密码">
                    </van-field>
                </van-form>
            </van-cell-group>

        </div>
        <button class="myBnt" @click="isHasUser">登录</button>
        <!-- 勾选服务 -->
        <van-checkbox v-model="checked" icon-size="12" class="myCheckBox">
            登录注册即表示同意
            <span class="blue">《用户协议》</span>
            和
            <span class="blue">《隐私政策》</span>
        </van-checkbox>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showDialog } from 'vant';
import { useRouterNameStore, accountNumber } from '../../stores/counter';
const store = useRouterNameStore();
const router = useRouter();
const userid = accountNumber();
let userName = ref("");
let userPaw = ref("");
let checked = ref(false);
const pattern = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;

// 配置对象e
interface localItem {
    userName: string
    userPaw: string
}

// 储存账号密码
function isHasUser() {
    const regTest = pattern.test(userName.value);
    // 正则判断
    if (!regTest) {
        showDialog({
            message: "您输入的手机号有误!",
            confirmButtonColor: "#ff4569",
            theme: "round-button",
        }).then(() => { });
        return;
    }

    if (userName.value && userPaw.value && checked.value) {
        let userList = localStorage.userList || `[]`;
        userList = JSON.parse(userList);

        let curU = userList.find((e: localItem) => e.userName == userName.value);

        if (!curU) {
            showDialog({
                message: "当前用户名不存在!",
                confirmButtonColor: "#ff4569",
                theme: "round-button",
            });
            userName.value = '';
            userPaw.value = '';
            return;
        }

        if (curU.userPaw != userPaw.value) {
            showDialog({
                message: "您的密码错误!",
                confirmButtonColor: "#ff4569",
                theme: "round-button",
            });
            return;
        }
        userid.accountName = userName.value
        localStorage.token = "salkjdklsdfjkging";

        // 跳转到点击进入的页面
        router.replace({ name: store.fromName })

    } else if (userName.value && userPaw.value && !checked.value) {
        showDialog({
            message: "请勾选《用户协议》和《隐私政策》!",
            confirmButtonColor: "#ff4569",
            theme: "round-button",
        }).then(() => {
            checked.value = true;
        });
    }
}

</script>

<style lang="scss" scoped>
.curLoginBox {
    height: 260px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-evenly;
    align-items: center;
    position: relative;
}

.myInputGroup {
    width: 300px;
}

.send {
    font-size: 12px;
    outline: none;
    border: none;
    color: var(--subject-color);
    background-color: white;
    border: 1px solid var(--subject-color);
    border-radius: 999px;
    padding: 3px 9px;
}

.myBnt {
    width: calc(100vw - 60px);
    padding: 10px 0;
    border: none;
    outline: none;
    color: white;
    border-radius: 999px;
    background-color: var(--subject-color);
}

.myCheckBox {
    font-size: 12px;

    position: absolute;
    bottom: -240px;

    .blue {
        color: #50969f;
    }
}
</style>