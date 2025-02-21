<script setup lang="ts">
import { reactive } from 'vue'
import CardTabs from '@/components/card-tabs.vue'
import Scheduled from '@/views/pages/task/components/scheduled.vue'

const conf = reactive({
  activeIndex: 0,
  list: [
    {
      name: '计划任务',
      index: 0,
      component: Scheduled
    },
    // ,{
    //   name: '任务编排',
    //   index: 1
    // },
    // {
    //   name: '脚本库',
    //   index: 2
    // }
  ],
  clickActive: (item: any) => {
    conf.activeIndex = item.index
  }
})
</script>

<template>
  <div class="task-container">
    <!-- <card-tabs :list="conf.list" :activeIndex="conf.activeIndex" :clickActive="conf.clickActive" /> -->
    <component :is="conf.list[conf.activeIndex].component" />
  </div>
</template>

<style scoped lang="less">
@import '@/styles/element.less';
@import '@/styles/common.less';
</style>
