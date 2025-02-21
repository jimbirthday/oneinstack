<script setup lang="ts">
import CardTabs from '@/components/card-tabs.vue'
import { markRaw, reactive } from 'vue'
import Firewall from './components/firewall.vue'

const conf = reactive({
  activeIndex: 0,
  list: markRaw([
    {
      name: '系统防火墙',
      index: 0,
      component: Firewall
    }
    // ,
    // {
    //   name: 'SSH管理',
    //   index: 1
    // },
    // {
    //   name: '安全检测',
    //   index: 2
    // },
    // {
    //   name: '违规词检测',
    //   index: 3
    // },
    // {
    //   name: 'PHP网站安全',
    //   index: 4
    // },
    // {
    //   name: '入侵防御',
    //   index: 5
    // },
    // {
    //   name: '系统加固',
    //   index: 6
    // }
  ]),
  clickActive: (item: any) => {
    conf.activeIndex = item.index
  }
  
})
</script>

<template>
  <div class="security-container">
    <!-- <card-tabs :list="conf.list" :activeIndex="conf.activeIndex" :clickActive="conf.clickActive" /> -->
    <component :is="conf.list[conf.activeIndex].component" />
  </div>
</template>

<style scoped lang="less">
@import '@/styles/element.less';
@import '@/styles/common.less';
</style>
