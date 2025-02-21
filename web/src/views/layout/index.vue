<script setup lang="ts">
import { reactive } from 'vue'
import SearchInput from '@/components/search-input.vue'
import ThemeSwitch from './components/theme-switch.vue'
import sapp from '@/sstore/sapp'
import { Fold, Expand } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import sconfig from '@/sstore/sconfig'



interface ItemColor {
  light: string[]
  dark: string[]
}

interface NavItem {
  name: string
  path: string
  icon: string
  activeColor: ItemColor
  children?: NavItem[]
  event?: () => void
}

const route = useRoute()

const conf = reactive({
  isCollapse: false,
  searchValue: '',
  defaultColor: {
    light: ['#8B8B8B', '#8B8B8B'],
    dark: ['#8B8B8B', '#8B8B8B']
  },
  navList: [
    {
      name: '首页',
      path: '/home',
      icon: 'home',
      activeColor: {
        light: ['#eab170', '#8B8B8B'],
        dark: ['#eab170', '#ffffff']
      }
    },
    {
      name: '网站',
      path: '/website',
      icon: 'website',
      activeColor: {
        light: ['#8B8B8B', '#eab170'],
        dark: ['#ffffff', '#eab170']
      }
    },
    {
      name: '数据库',
      path: '/database',
      icon: 'database',
      activeColor: {
        light: ['#eab170', '#8B8B8B'],
        dark: ['#eab170', '#ffffff']
      }
    },
    // {
    //   name: '监控',
    //   path: '/monitor',
    //   icon: 'monitor',
    //   activeColor: {
    //     light: ['#eab170', '#8B8B8B'],
    //     dark: ['#eab170', '#ffffff']
    //   }
    // },
    {
      name: '安全',
      path: '/security',
      icon: 'security',
      activeColor: {
        light: ['#eab170', '#8B8B8B'],
        dark: ['#eab170', '#ffffff']
      }
    },
    {
      name: '文件',
      path: '/file',
      icon: 'file',
      activeColor: {
        light: ['#eab170', '#8B8B8B'],
        dark: ['#eab170', '#ffffff']
      }
    },
    // {
    //   name: '日志',
    //   path: '/log',
    //   icon: 'log',
    //   activeColor: {
    //     light: ['#eab170', '#8B8B8B'],
    //     dark: ['#eab170', '#ffffff']
    //   }
    // },
    // {
    //   name: '终端',
    //   path: '/terminal',
    //   icon: 'terminal',
    //   activeColor: {
    //     light: ['#8B8B8B', '#eab170'],
    //     dark: ['#ffffff', '#eab170']
    //   }
    // },
    {
      name: '计划任务',
      path: '/task',
      icon: 'task',
      activeColor: {
        light: ['#8B8B8B', '#eab170'],
        dark: ['#ffffff', '#eab170']
      }
    },
    {
      name: '软件商店',
      path: '/software',
      icon: 'software',
      activeColor: {
        light: ['#8B8B8B', '#eab170'],
        dark: ['#ffffff', '#eab170']
      }
    },
    {
      name: '面板设置',
      path: '/setting',
      icon: 'setting',
      activeColor: {
        light: ['#8B8B8B', '#eab170'],
        dark: ['#ffffff', '#eab170']
      }
    },
    {
      name: '退出',
      path: '',
      icon: 'exit',
      activeColor: {
        light: ['#8B8B8B', '#eab170'],
        dark: ['#ffffff', '#eab170']
      },
      event: async () => {
        Beturn()
      }
    }
  ] as NavItem[]
})
const Beturn =()=>{
  ElMessageBox.confirm('退出面板登录，是否继续？', '退出登录', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then((res) => {
            if (res === 'confirm') {
              ElMessage({
                type: 'success',
                message: '退出成功'
              })
              sconfig.logout(true)
            }
          })
          .catch(() => {})
}
const BindButton = ()=>{
  conf.isCollapse = !conf.isCollapse
}
</script>

<template>
  <el-container class="layout-container">
    <el-header class="layout-container__header">
      <div class="layout-container__header-left">
        <img class="logo" src="/static/images/logo.png" alt="" />
        <img class="logo-text" :src="`/static/images/logo-text-${sapp.theme}.png`" alt="" />
      </div>
      <div class="layout-container__header-right">
        <search-input v-model="conf.searchValue" placeholder="请输入关键词进行搜索" />
        <img class="avatar-img" src="/static/images/avatar.png" alt="" />
        <el-dropdown placement="bottom">
			<img class="arrow-down" src="/static/images/arrow-down.png" alt="" />
		
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="Beturn">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
       
      </div>
    </el-header>
    <el-container class="layout-container__body">
      <div class="layout-container__body-left" :class="{ 'isCollapse': !conf.isCollapse }">
        <div class="column fit-height fit-width" style="gap: 26px; align-items: center">
          <div class="col column nav-bar fit-width">
            <div class="col relative fit-width">
              <div class="absolute fit-height fit-width">
                <el-scrollbar height="100%">
                  <el-menu :collapse="conf.isCollapse" :default-active="route.path.match(/\/\w*/)?.[0]" router>
                    <template v-for="item in conf.navList" :key="item.path">
                      <el-sub-menu v-if="item.children" :index="item.path" :popper-offset="-110">
                        <template #title>
                          <v-s-icon
                            :name="item.icon"
                            :color="
                              item.path && route.path.includes(item.path)
                                ? item.activeColor[sapp.theme]
                                : conf.defaultColor[sapp.theme]
                            "
                            size="26"
                          />
                          <span class="menu-item-name">{{ item.name }}</span>
                        </template>
                        <el-menu-item
                          v-for="child in item.children"
                          :key="child.path"
                          :index="child.path"
                          @click="child.event?.()"
                        >
                          <v-s-icon
                            :name="child.icon"
                            :color="
                              child.path && route.path.includes(child.path)
                                ? child.activeColor[sapp.theme]
                                : conf.defaultColor[sapp.theme]
                            "
                            size="26"
                          />
                          <span class="menu-item-name">{{ child.name }}</span>
                        </el-menu-item>
                      </el-sub-menu>
                      <el-menu-item v-else :index="item.path" @click="item.event?.()">
                        <v-s-icon
                          :name="item.icon"
                          :color="
                            item.path && route.path.includes(item.path)
                              ? item.activeColor[sapp.theme]
                              : conf.defaultColor[sapp.theme]
                          "
                          size="26"
                        />
                        <span class="menu-item-name">{{ item.name }}</span>
                      </el-menu-item>
                    </template>
                  </el-menu>
                </el-scrollbar>
              </div>
            </div>
            <el-icon class="icon-collapse" color="#7A7F86" :size="18" @click="">
              <Fold v-if="!conf.isCollapse" />
              <Expand v-else />
            </el-icon>
          </div>
          <theme-switch class="theme-switch" />
        </div>
      </div>
      <el-main class="layout-container__body-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="less">
.layout-container {
  background: rgb(var(--bg-color));
  height: 100vh;

  &__header {
    height: fit-content;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-left {
      display: flex;
      align-items: center;
      gap: 6px;

      .logo {
        width: 84px;
        height: 84px;
      }

      .logo-text {
        width: 176px;
        height: 18px;
      }
    }

    &-right {
      display: flex;
      align-items: center;
      gap: 10px;

      .avatar-img {
        margin-inline: 28px 12px;
        width: 44px;
        height: 44px;
      }

      .arrow-down {
        width: 16px;
        height: 16px;
      }
    }
  }

  &__body {
    position: relative;

    &-left {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 31px;
      transition: width 0.3s;
      width: 78px;

      &.isCollapse {
        width: 206px;
      }

      .nav-bar {
        padding: 26px 0 0;
        background-color: rgb(var(--bg-card-color));
        border-radius: 0 16px 16px 0;
        position: relative;
        overflow: hidden;

        :deep(.el-scrollbar__bar.is-horizontal) {
          display: none;
        }

        .icon-collapse {
          width: 100%;
          height: 67px;
          background-color: rgb(var(--bg-card-color));
          cursor: pointer;
        }
      }

      .el-menu {
        width: 100%;
        height: 100%;
        border-right: none;
        overflow: auto;
        position: relative;
        background-color: transparent;
        overflow: hidden;

        .menu-item-name {
          font-family: PingFang SC;
          font-size: 16px;
          color: var(--menu-item-name-color);
          margin-left: 16px;
          transition: color 0.3s;
        }

        &.el-menu--collapse {
          background-color: rgb(var(--bg-card-color));

          .el-menu-item {
            &::before {
              content: none;
            }
          }
        }

        .el-menu-item,
        :deep(.el-sub-menu__title) {
          width: 190px;
          height: 50px;
          border-radius: 2px;
          position: relative;

          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 3px;
            height: 24px;
            background: var(--el-color-primary);
            border-radius: 2px;
            opacity: 0;
            transition: opacity 0.3s;
          }

          &:hover,
          &.is-active {
            background: rgba(var(--menu-item-bg-color-hover), 0.58);

            &::before {
              opacity: 1;
            }

            .menu-item-name {
              color: var(--font-color-black);
              font-weight: 500;
            }
          }

          .el-sub-menu__icon-arrow {
            color: var(--font-color-gray);
            transform: rotate(-90deg) !important;
            width: auto;
          }
        }

        :deep(.el-sub-menu) {
          .el-menu {
            background-color: rgb(var(--bg-card-color));
          }

          &.is-opened {
            .el-sub-menu__icon-arrow {
              transform: rotate(0deg) !important;
              width: auto;
            }
          }
        }
      }
    }

    &-main {
      width: 100%;
      height: 100%;
      padding: 0 30px 0 24px;
    }
  }
}
</style>
