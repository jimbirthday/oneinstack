<script setup lang="ts">
import { reactive, useTemplateRef,ref } from 'vue'
import LoginContainer from './components/login-container.vue'
import System from '@/utils/System'
import { Api } from '@/api/Api'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import sconfig from '@/sstore/sconfig'
import i18n from '@/lang/index.ts'

const isMobile = ref(window.innerWidth <= 768 ? false : true)

window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth >= 768
})

const conf = reactive({
  form: {
    username: '',
    password: '',
    remember: false
  },
  loading: false,
  formRef: useTemplateRef<FormInstance>('formRef'),
  rules: {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
  } as FormRules,
  handleLogin: () => {
    conf.formRef?.validate(async valid => {
      if (!valid) return
      conf.loading = true
      const { data: res } = await Api.login({
        ...conf.form,
        final: () => conf.loading = false
      })
      console.log(res)
      ElMessage.success('登录成功')
      
      sconfig.login(res)
      setTimeout(() => {
        System.router.push('/')
      }, 500)
      // getSystemInfo()
    })
  },
  handleToAppLogin: () => {
    System.router.push('/login/scan')
  }
})
// //获取网页标题并修改网页标题
// const getSystemInfo = async () => {
//   try {
//     const { data: res } = await Api.getSystemInfo()
//     document.title = res.title+'' 
//   } catch (error) {
//     ElMessage.error('获取系统信息失败')
//   }
// }
</script>

<template>
  <login-container :loading="conf.loading" currentActive="login">
    <template #default="{ className }">
      <div class="logo-box flex justify-center fit-width" :class="{'mobile-logo': isMobile}" style="padding: 100px 0 60px;">
        <transition name="logo-fade" mode="out-in">
          <img v-if="isMobile" src="/static/images/logo-pc.png" alt="logo" width="320" height="60" key="pc-logo" />
          <img v-else src="/static/images/logo-app.png" alt="logo" width="180" height="180" key="mobile-logo" />
        </transition>
      </div>
      <div class="" :class="{'login-title-box': isMobile}">
        <div class="login-title flex" :class="{'mobile-title': isMobile}">
			 <!-- {{i18n.t('welcome')}} -->
          <transition name="fade" mode="out-in">
			 
            <div style="flex: 1;" :key="!isMobile ? 1 : 0">{{ isMobile ? '欢迎使用': '欢迎来到Oneinstack' }}</div>
          </transition>
        </div>
        <el-form ref="formRef" :model="conf.form" :rules="conf.rules" class="fit-width">
          <el-form-item :class="[className.formItemGap, {'input-box': !isMobile}]" prop="username" >
            <el-input v-model="conf.form.username" placeholder="输入您的账户/手机号/邮箱号" clearable  :class="{'pc-input': isMobile}">
              <template #prefix>
                <v-s-icon name="user" size="30" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password" :class="{'input-box': !isMobile}">
            <el-input v-model="conf.form.password" placeholder="输入您的密码" type="password" clearable :class="{'pc-input': isMobile}" >
              <template #prefix>
                <v-s-icon name="password" size="30" />
              </template>
            </el-input>
          </el-form-item>
          <div class="flex justify-between">
            <el-checkbox v-model="conf.form.remember" label="记住密码" />
          </div>
          <button :class="[className.loginBtn, {'mobile-btn': isMobile}]" @click.prevent="conf.handleLogin">登录</button>
        </el-form>
      </div>
      <!-- <div :class="className.other">
        <el-divider class="login-content-right__main-other-title">
          <el-link @click="conf.handleToAppLogin">App扫码登录</el-link>
        </el-divider>
      </div> -->
    </template>
  </login-container>
</template>

<style scoped lang="less">
@primary-color: #f7911c;
@font-gray: #a2a2a2;
@border-gray: #e3e3e3;
@bg-color: #f5f5f5;

.login-title{
  display: flex;
  font-size: 32px;
  font-weight: 600;
  color: #2b2b2b;
  margin-bottom: 20px;
  text-align: left;
  justify-content: flex-start;
  width: 100%;
}
.login-title-box{
  width: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  padding: 62px;
  border-radius: 10px;
}
.input-box{
  width: 300px;
height: 62px;
background: #FAF4EC;
border-radius: 20px 20px 20px 20px;
padding:  0 20px;
}
.pc-input{
  // border-bottom: none;
  border-bottom: 1px solid #f5f5f5
}
.login-content-right__main {
  &-logo {
    margin-bottom: 80px;
  }

  &-other {
    &-btn {
      margin-top: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 14px;
      font-size: 16px;
      color: #2b2b2b;
      cursor: pointer;

      .vsicon {
        border-radius: 50%;
        transition: box-shadow 0.3s;
      }

      &:hover {
        color: @primary-color;

        .vsicon {
          box-shadow: 0 0 10px @primary-color;
        }
      }
    }
  }
}
</style>
