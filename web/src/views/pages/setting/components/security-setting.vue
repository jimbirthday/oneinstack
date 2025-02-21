<script setup lang="ts">
import { reactive, ref } from 'vue'
import settingForm, { FormItem } from './setting-form.vue'
import { watchEffect } from 'vue'
import PortDialog from './port-dialog.vue'

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
    //   label: '面板安全告警',
    //   prop: '',
    //   value: 1,
    //   type: 'switch',
    //   action: {
    //     text: '提醒方式',
    //     click: () => {}
    //   },
    //   tip: '告警内容包含：面板用户变更、面板日志删除、面板开启开发者'
    // },
    // {
    //   label: '面板SSL',
    //   prop: '',
    //   value: 1,
    //   type: 'switch',
    //   action: {
    //     text: '面板ssL配置',
    //     click: () => {}
    //   },
    //   tip: '告警内容包含：面板用户变更、面板日志删除、面板开启开发者，<span style="color: var(--el-color-primary)">了解详情</span>'
    // },
    // {
    //   label: 'BasicAuth认证',
    //   prop: '',
    //   value: '宝塔Linux面板',
    //   type: 'input',
    //   tip: '为面板增加一道基于BasicAuth的认证服务，有效防止面板被扫描，<span style="color: var(--el-color-primary)">了解详情</span>'
    // },
    // {
    //   label: '动态口令认证',
    //   prop: '',
    //   value: '',
    //   type: 'input',
    //   action: {
    //     text: '动态口令配置',
    //     click: () => {}
    //   },
    //   tip: '(Google Authenticator，谷歌身份认证)为面板提供动态口令的登录的验证，同一个IP验证成功后24小时内无需再次验证，<span style="color: var(--el-color-primary)">了解详情</span>'
    // },
    // {
    //   label: '访问设备验证',
    //   prop: '',
    //   value: '24小时',
    //   type: 'input',
    //   disabled: true,
    //   action: {
    //     text: '访问设备验证配置',
    //     click: () => {}
    //   },
    //   tip: '基于SSL证书双向验证，开启后电脑需要安装此证书，否则将无法访问，属于极高安全级别的访问限制方式，类似银行账号U盘密钥登录。<span style="color: var(--el-color-primary)">了解详情</span>'
    // },
    // {
    //   label: '密码复杂度验证',
    //   prop: '',
    //   value: '1',
    //   type: 'switch',
    //   tip: '为面板密码提供复杂度验证方式，复杂度验证规则：<span style="color: var(--el-color-primary)">密码必须满足密码长度大于8位且大写字母、小写字母、数字、特殊字符至少3项组合</span>'
    // },
    // {
    //   label: '绑定域名',
    //   prop: '',
    //   value: '',
    //   type: 'input',
    //   action: {
    //     type: 'primary',
    //     text: '保存',
    //     click: () => {}
    //   },
    //   tip: '为面板绑定一个访问域名，<span style="color: var(--el-color-primary)">注意：一旦绑定域名，只能通过域名访问面板</span>'
    // },
    // {
    //   label: '授权IP',
    //   prop: '',
    //   value: '示例：1.1.1.1，2.2.2.1-2.2.2.2',
    //   type: 'input',
    //   action: {
    //     type: 'primary',
    //     text: '保存',
    //     click: () => {}
    //   },
    //   tip: '设置访问授权IP，多个IP地址，请使用"-"分割，<span style="color: var(--el-color-primary)">注意：一旦设置授权IP，只有指定IP的电脑能访问面板</span>'
    // },
    {
      label: '面板端口',
      prop: 'port',
      value: '',
      type: 'input', 
      disabled: true,
      action: {
        type: 'primary',
        text: '设置',
        click: () => {
          portDialog.value = true
          ruleForm.value.port = String(conf.settingData[0].value)
        }
      },
      tip: '例如:8080<span style="color: var(--el-color-primary)">注意：有安全组的服务器请提前在安全组放行新端口</span>'
    },
    // {
    //   label: '安全入口',
    //   prop: '',
    //   value: '/btpanel',
    //   type: 'input',
    //   disabled: true,
    //   action: {
    //     type: 'primary',
    //     text: '设置',
    //     click: () => {}
    //   },
    //   tip: '面板管理入口，设置后只能通过指定安全入口登录面板,如: /www_bt_cn'
    // },
    // {
    //   label: '未认证响应状态',
    //   prop: '',
    //   value: '404-页面不存在',
    //   type: 'input',
    //   disabled: true,
    //   action: {
    //     type: 'primary',
    //     text: '设置',
    //     click: () => {}
    //   },
    //   tip: '用于在IP未成功登录过且未正确输入安全入口时的响应，可用于隐藏面板特征'
    // },
    // {
    //   label: '密码过期时间',
    //   prop: '',
    //   value: '未设置',
    //   type: 'input',
    //   disabled: true,
    //   action: [
    //     {
    //       type: 'primary',
    //       text: '设置',
    //       click: () => {}
    //     }
    //   ],
    //   tip: '为面板密码设置过期时间，过期后需要重新设置密码'
    // },
    // {
    //   label: '临时访问授权',
    //   prop: '',
    //   value: '',
    //   type: 'none',
    //   action: [
    //     {
    //       type: 'primary',
    //       text: '临时访问授权管理',
    //       click: () => {}
    //     }
    //   ],
    //   tip: '隐藏左侧菜单栏目'
    // },
    // {
    //   label: '地区登录限制',
    //   prop: '',
    //   value: 1,
    //   type: 'switch',
    //   action: [
    //     {
    //       text: '设置地区登陆限制',
    //       click: () => {}
    //     }
    //   ],
    //   tip: '设置面板地区登录策略'
    // }
  ]
})

const dialogVisible = ref(false)
const portDialog = ref(false)

const ruleForm = ref({
  port: ''
})

const getSystemInfo = async () => {
  const res = props.allinfo  // 使用 props 中的数据
  if (!res) return
  conf.settingData.forEach(item => {
    if (res) {  // 检查 res.data 是否存在
      item.value = res[item.prop] || res.user?.[item.prop] || ''
    }
  })
}
watchEffect(() => {
  getSystemInfo()
  console.log(props.allinfo,'allinfo')
  
})
</script>

<template>
  <div class="basic-card" :class="{ isCard }">
    <div class="basic-card__header">
      <div class="basic-card__title">安全设置</div>
    </div>
    <div class="basic-card__body">
      <setting-form :data="conf.settingData" />
    </div>
  </div>

  <PortDialog 
    v-model="portDialog"
    :form="ruleForm"
  />
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
