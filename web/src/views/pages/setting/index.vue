<script setup lang="ts">
import { markRaw, reactive } from 'vue'
import CardTabs from '@/components/card-tabs.vue'
import AllSetting from './components/all.vue'
import PanelSetting from './components/panel-setting.vue'
import SecuritySetting from './components/security-setting.vue'
import AlarmNotification from './components/alarm-notification.vue'
import MessageNotification from './components/message-notification.vue';

const conf = reactive({
  activeIndex: 0,
  menuList: markRaw([
    {
      name: '全部设置',
      index: 0,
      component: AllSetting
    },
    // {
    //   name: '面板设置',
    //   index: 1,
    //   component: PanelSetting
    // },
    // {
    //   name: '安全设置',
    //   index: 2,
    //   component: SecuritySetting
    // },
    // {
    //   name: '告警通知',
    //   index: 3,
    //   component: AlarmNotification
    // },
    // {
    //   name: '消息通知',
    //   index: 4,
    //   component: MessageNotification
    // }
  ]),
  clickActive: (item: any) => {
    conf.activeIndex = item.index
  }
})
</script>

<template>
  <div class="setting-container relative">
    <div class="absolute fit-width" style="padding-bottom: 35px">
      <!-- <card-tabs
        :list="conf.menuList"
        :activeIndex="conf.activeIndex"
        :clickActive="conf.clickActive"
        style="margin-bottom: 20px"
      /> -->
      <component :is="conf.menuList[conf.activeIndex].component" />
    </div>
  </div>
</template>

<style scoped lang="less">
@import '@/styles/element.less';
@import '@/styles/common.less';
</style>
