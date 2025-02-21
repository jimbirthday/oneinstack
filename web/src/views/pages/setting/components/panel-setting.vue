<script setup lang="ts">
import { reactive } from 'vue'
import settingForm, { FormItem } from './setting-form.vue'
import { Api } from '@/api/Api'
import { onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { watchEffect } from 'vue'



interface Props {
  isCard?: boolean
  allinfo?: any
}

interface Config {
  settingData: FormItem[]
  [key: string]: any
}

const props = withDefaults(defineProps<Props>(), {
  isCard: true,
  allinfo: () => ({})
})

const conf = reactive<Config>({
  settingData: [
    // {
    //   label: '监听IPv6',
    //   prop: '',
    //   value: 1,
    //   type: 'switch',
    //   tip: '监听IPv6地址的访问'
    // },
    // {
    //   label: 'API接口',
    //   prop: '',
    //   value: 1,
    //   type: 'switch',
    //   action: {
    //     text: 'API接口配置',
    //     click: () => {}
    //   },
    //   tip: '提供面板API接口访问的支持（<span style="color: var(--el-color-primary)">堡塔APP</span>需要开启该功能），了解详情'
    // },
    {
      label: '面板别名',
      prop: 'title',
      value: '',
      type: 'input',
      action: {
        type: 'primary',
        text: '保存',
        click: async () => {
          try {
            const title = conf.settingData.find(item => item.prop === 'title')?.value
            
            const { data } = await Api.updateSystemTitley({ title :title})
            if(data) {
              document.title = title+''
              ElMessage.success('修改成功')
            }
          } catch(error) {
            ElMessage.error('修改失败')
          }
        }
      },
      tip: '给面板取个别的名称，用于网页标题'
    },
    // {
    //   label: '左侧菜单标题',
    //   prop: '',
    //   value: '',
    //   type: 'input',
    //   action: {
    //     type: 'primary',
    //     text: '保存',
    //     click: () => {}
    //   },
    //   tip: '给左侧菜单标题取个别的名称'
    // },
    // {
    //   label: '超时时间',
    //   prop: '',
    //   value: '24小时',
    //   type: 'input',
    //   disabled: true,
    //   action: {
    //     type: 'primary',
    //     text: '设置',
    //     click: () => {}
    //   },
    //   tip: '如果用户超过设置时间，未操作面板，面板将自动退出登录'
    // },
    // {
    //   label: '默认建站目录',
    //   prop: '',
    //   value: '/www/wwwroot',
    //   type: 'file',
    //   action: {
    //     type: 'primary',
    //     text: '保存',
    //     click: () => {}
    //   },
    //   tip: '创建的站点，默认将保存到该目录下'
    // },
    // {
    //   label: '默认备份目录',
    //   prop: '',
    //   value: '/www/backup',
    //   type: 'file',
    //   action: {
    //     type: 'primary',
    //     text: '保存',
    //     click: () => {}
    //   },
    //   tip: '网站和站点默认的备份目录'
    // },
    // {
    //   label: '服务器IP',
    //   prop: '',
    //   value: '192.168.31.58',
    //   type: 'input',
    //   action: {
    //     type: 'primary',
    //     text: '保存',
    //     click: () => {}
    //   },
    //   tip: '默认为外网IP,若您在本地虚拟机测试，请填写虚拟机内网IP'
    // },
    // {
    //   label: '服务器时间',
    //   prop: '',
    //   value: '2024-12-04 10:48:35 CST +0800',
    //   type: 'input',
    //   action: {
    //     type: 'primary',
    //     text: '同步',
    //     click: () => {}
    //   },
    //   tip: '同步当前服务器时间'
    // },
    {
      label: '面板账号',
      prop: 'username', 
      value: '',
      type: 'input',
      disabled: false,
      action: {
        type: 'primary',
        text: '保存',
        click: async() => {
          try {
            const username = conf.settingData.find(item => item.prop === 'username')?.value
            const { data } = await Api.updateUpdateuser({ username :username})
            if(data) {
              ElMessage.success('修改成功')
            }
          } catch(error) {
            ElMessage.error('修改失败')
          }
        }
      },
      tip: '设置面板账号，用于登录面板'
    },
    {
      label: '面板密码',
      prop: 'password',
      value: '',
      type: 'password',
      disabled: false,
      action: {
        type: 'primary',
        text: '保存',
        click: async() => {
          try {
            const password = conf.settingData.find(item => item.prop === 'password')?.value
            const username = conf.settingData.find(item => item.prop === 'username')?.value
            const { data } = await Api.updateResetpassword({ password :password,username:username})
            if(data) {
              ElMessage.success('修改成功')
            }
          } catch(error) {
            ElMessage.error('修改失败')
          }
        }
      },
      tip: '设置面板密码，用于登录面板'
    },
    // {
    //   label: '绑定宝塔账号',
    //   prop: '',
    //   value: '139****2746',
    //   type: 'password',
    //   disabled: true,
    //   action: [
    //     {
    //       type: 'primary',
    //       text: '设置',
    //       click: () => {}
    //     },
    //     {
    //       text: '解绑',
    //       click: () => {}
    //     }
    //   ],
    //   tip: '面板大多数功能依赖云端服务(证书申请，产品购买，软件列表等)，该功能仅用于云端服务，不涉及敏感操作'
    // },
    // {
    //   label: '面板菜单栏隐藏',
    //   prop: '',
    //   value: '无配置',
    //   type: 'input',
    //   disabled: true,
    //   action: [
    //     {
    //       type: 'primary',
    //       text: '设置',
    //       click: () => {}
    //     }
    //   ],
    //   tip: '隐藏左侧菜单栏目'
    // },
    // {
    //   label: '面板云端请求方式',
    //   prop: '',
    //   value: 'Python',
    //   type: 'input',
    //   disabled: true,
    //   action: [
    //     {
    //       type: 'primary',
    //       text: '设置',
    //       click: () => {}
    //     }
    //   ],
    //   tip: '面板请求云端时，使用的请求方式，默认支持python、curl、php，请根据实际情况切换'
    // },
    // {
    //   label: '面板云端请求线路',
    //   prop: '',
    //   value: 'IPv4',
    //   type: 'input',
    //   disabled: true,
    //   action: [
    //     {
    //       type: 'primary',
    //       text: '设置',
    //       click: () => {}
    //     }
    //   ],
    //   tip: '面板请求云端时，使用的请求线路，默认支持auto、ipv4、ipv6，请根据实际情况切换'
    // },
    // {
    //   label: '面板云端通讯节点配置',
    //   prop: '',
    //   value: '自动选择',
    //   type: 'input',
    //   disabled: true,
    //   action: [
    //     {
    //       type: 'primary',
    //       text: '设置',
    //       click: () => {}
    //     }
    //   ],
    //   tip: '请勿随意调整节点配置，仅获取云端数据出现未响应或错误时，可尝试切换该节点'
    // }
  ]
})

const getSystemInfo = async () => {
  const res = props.allinfo  // 使用 props 中的数据
  if (!res) return
  conf.settingData.forEach(item => {
    if (res) {  // 检查 res.data 是否存在
      item.value = res[item.prop] || res.user?.[item.prop] || ''
      if (item.prop === 'password') {
        // const passwordlen = res[item.prop] || res.user?.[item.prop].length || 6
        // 如果 prop 是 password，将值设置为 '******'
        item.value = '******'
      }
    }
  })
  // conf.settingData.password =''
}
watchEffect(() => {
  getSystemInfo()
  console.log(props.allinfo,'allinfo',conf.settingData)
  
})
</script>

<template>
  <div class="basic-card" :class="{ isCard }">
    <div class="basic-card__header">
      <div class="basic-card__title">面板设置</div>
    </div>
    <div class="basic-card__body">
      <setting-form :data="conf.settingData" />
    </div>
  </div>
</template>

<style scoped lang="less">
.basic-card {
  width: 100%;

  &.isCard {
    background: rgb(var(--bg-card-color));
    border-radius: 5px;
    padding: 26px 30px;
  }

  &__title {
    display: flex;
    align-items: center;
    position: relative;
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 16px;
    color: var(--font-color-black);

    &::before {
      content: '';
      background: var(--el-color-primary);
      width: 5px;
      height: 22px;
      margin-right: 18px;
    }
  }

  &__header {
    padding: 17px 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid rgb(var(--border-color-gray-light));
  }

  &__body {
    padding: 24px 0;
  }
}
</style>
