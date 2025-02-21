<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Setting, ArrowDown, VideoPlay, VideoPause, Warning } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Api } from '@/api/Api'
import AddTask from './add-task.vue'
import formatCron from '@/utils/cronutils'

const tableRef = ref<InstanceType<typeof import('element-plus')['ElTable']>>()

interface RuleForm {
  name: string
  region: string
  count: string
  desc: string
}

interface Task {
  id: number
  enabled: boolean
  // 其他属性...
}

const multipleSelection = ref<Task[]>([])
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 清空表格选中状态的方法
const clearTableSelection = () => {
  if (tableRef.value) {
    tableRef.value.clearSelection()
  }
}

let searchValue = ref('')
const tableData = ref([])

const getData = async () => {
  multipleSelection.value = []
  try {
    const { data: res } = await Api.getPlanTaskList({
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      q: searchValue.value
    })
    console.log(res, 'res')
    if (res) {
      tableData.value = res.data || []
      pagination.total = res.total || 0
    } else {
      ElMessage.error(res?.message || '获取数据失败')
    }
  } catch (error) {
    ElMessage.error('获取数据失败')
    tableData.value = []
    pagination.total = 0
  }
}

const category = ref(['传统项目', 'swoole异步项目', 'thinkphp异步项目', '异步项目', '一键部署', '批量创建'])

const formInline = reactive({
  user: '',
  region: '',
  date: ''
})

const onSubmit = () => {
  console.log('submit!')
  pagination.pageSize = 10
  pagination.currentPage = 1
  searchValue.value = ''
  getData()
}

const enabledClick = () => {
  ElMessageBox.confirm('计划任务暂停后将无法继续运行，您真的要停用这个计划任务吗？', '设置计划任务状态', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
   .then(() => {
      ElMessage({
        type: 'success',
        message: '退出成功'
      })
    })
   .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消退出'
      })
    })
}

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  name: 'Hello',
  region: '',
  count: '',
  desc: ''
})
let action_type = ref(true)
let rulesForm = ref({
  name: '',
  cron_type: '',
  schedule: '',
  created_at: '',
  deleted_at: '',
  id: '',
  command: '',
  enabled: true,
  updated_at: ''
})

const filterDirection = ref('')
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`
}

const addTaskVisible = ref(false)
const addTask = () => {
  action_type.value = true
  addTaskVisible.value = true
  rulesForm.value = {
  name: '',
  cron_type: '',
  schedule: '',
  created_at: '',
  deleted_at: '',
  id: '',
  command: '',
  enabled: true,
  updated_at: ''
}
}

const handleTaskAdded = (data: any) => {
  console.log('接收到子组件传递的数据:', data)
  // addTaskVisible.value = false
  getData()
}
const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
  getData()
}

// 处理表格选中项变化的方法
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val
}

// 批量删除方法
const batchDelete = async () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning('请选择要删除的任务')
    return
  }
  ElMessageBox.confirm('确定要删除选中的任务吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const ids = multipleSelection.value.map((item: Task) => item.id)
    try {
      await Api.deletePlanTask({ ids })
      ElMessage.success('删除成功')
      getData()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    ElMessage.info('取消删除')
  })
}

// 批量禁止方法
const batchDisable = async () => {
  const validSelection = multipleSelection.value.filter(item => item.enabled === true)
  if (validSelection.length === 0) {
    ElMessage.warning('请选择运行中的任务进行禁止')
    return
  }
  ElMessageBox.confirm('确定要禁止选中的任务吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const ids = validSelection.map(item => item.id)
    try {
      await Api.disablePlanTask({ ids })
      ElMessage.success('禁止成功')
      getData()
      clearTableSelection()
    } catch (error) {
      ElMessage.error('禁止失败')
    }
  }).catch(() => {
    ElMessage.info('取消禁止')
  })
}

// 批量开启方法
const batchEnable = async () => {
  const validSelection = multipleSelection.value.filter(item => item.enabled === false)
  if (validSelection.length === 0) {
    ElMessage.warning('请选择已停用的任务进行开启')
    return
  }
  ElMessageBox.confirm('确定要开启选中的任务吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const ids = validSelection.map(item => item.id)
    try {
      await Api.enablePlanTask({ ids })
      ElMessage.success('开启成功')
      getData()
      clearTableSelection()
    } catch (error) {
      ElMessage.error('开启失败')
    }
  }).catch(() => {
    ElMessage.info('取消开启')
  })
}

// 单条数据删除方法
const deleteSingleTask = async (row: any) => {
  ElMessageBox.confirm('确定要删除该任务吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await Api.deletePlanTask({ ids: [row.id] })
      ElMessage.success('删除成功')
      getData()
      clearTableSelection()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    ElMessage.info('取消删除')
  })
}

// 单条数据禁用方法
const disableSingleTask = async (row: any) => {
  if (row.enabled === false) {
    ElMessage.warning('该任务已停用，无需再次禁用')
    return
  }
  ElMessageBox.confirm('确定要禁用该任务吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await Api.disablePlanTask({ ids: [row.id] })
      ElMessage.success('禁用成功')
      getData()
    } catch (error) {
      ElMessage.error('禁用失败')
    }
  }).catch(() => {
    ElMessage.info('取消禁用')
  })
}

// 单条数据开启方法
const enableSingleTask = async (row: any) => {
  if (row.enabled === true) {
    ElMessage.warning('该任务正在运行，无需再次开启')
    return
  }
  ElMessageBox.confirm('确定要开启该任务吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await Api.enablePlanTask({ ids: [row.id] })
      ElMessage.success('开启成功')
      getData()
    } catch (error) {
      ElMessage.error('开启失败')
    }
  }).catch(() => {
    ElMessage.info('取消开启')
  })
}

// 更新单条数据方法
const updateSingleTask = async (row: any) => {
  action_type.value = false
  addTaskVisible.value = true
  rulesForm.value = {
    name: row.name,
    cron_type: row.cron_type,
    schedule: row.schedule,
    created_at: row.created_at,
    deleted_at: row.deleted_at,
    id: row.id,
    command: row.command,
    enabled: row.enabled,
    updated_at: row.updated_at
  }
  // 这里可以传递 row 数据到子组件进行编辑
  // 例如：addTaskVisible.value = { ...row }
}
// 选择过滤函数，控制选择逻辑
const selectFilter = (row: any) => {
  return true
}

// 全选过滤函数，控制全选逻辑
const selectAllFilter = (rows: any[]) => {
  return rows.filter(row => selectFilter(row))
}

// 上一页
const prevPage = () => {
  if (pagination.currentPage > 1) {
    pagination.currentPage--
    getData()
  }
}

// 下一页
const nextPage = () => {
  const totalPages = Math.ceil(pagination.total / pagination.pageSize)
  if (pagination.currentPage < totalPages) {
    pagination.currentPage++
    getData()
  }
}

// 处理每页数量变化
const handlePageSizeChange = (newSize: number) => {
  pagination.pageSize = newSize
  pagination.currentPage = 1
  getData()
}

onMounted(() => {
  getData()
})
</script>



<template>
  <div class="container">
    <el-card >
      <div class="" style="display: flex;">
      <el-space class="btn-group" >
        <el-button type="primary" @click="addTask">添加任务</el-button>
        <!-- <el-button type="primary">执行任务</el-button> -->
        <el-button type="primary" @click="batchEnable">启动任务</el-button>
        <el-button type="primary"  @click="batchDisable">停止任务</el-button>
        <el-button type="primary" @click="batchDelete">删除任务</el-button>
      </el-space>
      <div class="demo-form-inline flex" style="margin-left: auto;">
        <!-- <el-dropdown>
          <el-button type="primary" class="mr-2">
            <span class="el-dropdown-link">
              全部分类
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>分类</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown> -->
        <search-input placeholder="请输入域名或备注" style="margin-right: 18px" v-model="searchValue" @search="getData() "/>
        <el-button :icon="Refresh" type="primary" @click="onSubmit" style="margin-left: auto;"/>
        <!-- <el-button :icon="Setting" type="primary" @click="onSubmit" /> -->
      </div>
    </div>
  </el-card>
    
    <div class="box2">
      <el-table
        ref="tableRef"
        class="fileTable"
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :select-on-indeterminate="false"
        :row-selectable="selectFilter"
        :row-key="(row: any) => row.id"   
        empty-text="暂无数据"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true" :selectable="selectFilter" />
        <el-table-column prop="name" label="任务名称" width="180"></el-table-column>
        <el-table-column prop="enabled" label="状态" width="180">
          <template #default="scope">
            <div style="display: flex; flex-direction: row; align-items: center; cursor: pointer">
              <a
                style="color: #64ffc9; text-decoration: underline ;display: flex;" class="abox"
                v-if="scope.row.enabled"
                @click="disableSingleTask(scope.row)"
              >
                运行中
                <el-icon><VideoPlay /></el-icon>
              </a>
              <a style="color: #FF4848; text-decoration: underline; " class="abox" v-else-if="!scope.row.enabled "  @click="enableSingleTask(scope.row)">
                <el-icon><VideoPause /></el-icon>
                已停用
              </a>
              <!-- <a style="color: #ff8888; text-decoration: underline"  class="abox" v-else>
                <el-icon><Warning /></el-icon>
                运行异常
              </a> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="执行周期">
          <template #default="scope">
            <div style="display: flex; flex-direction: row; align-items: center; cursor: pointer">
              <span v-html="formatCron(scope.row.schedule)"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="updated_at" label="上次执行时间">
          <template #default="scope">
            <div style="display: flex; flex-direction: row; align-items: center; cursor: pointer">
              <span>{{ formatDate(scope.row.updated_at) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="enableSingleTask(scope.row)" v-if="!scope.row.enabled">
              开启
            </el-button>
            <el-button link type="primary" size="small" @click="disableSingleTask(scope.row)" v-if="scope.row.enabled ">
              禁用
            </el-button>
            <el-button link type="primary" size="small" @click="deleteSingleTask(scope.row)">
              删除
            </el-button>
            <el-button link type="primary" size="small" @click="updateSingleTask(scope.row)">
              更新
            </el-button>
          </template>
        </el-table-column>
        <!-- 自定义表格底部栏用于分页 -->
        <template #footer>
          <tr>
            <td colspan="6">
              <div class="table-pagination">
                <el-select v-model="pagination.pageSize" @change="handlePageSizeChange">
                  <el-option label="10" value="10"></el-option>
                  <el-option label="20" value="20"></el-option>
                  <el-option label="50" value="50"></el-option>
                </el-select>
                <span>条/页</span>
                <el-button @click="prevPage" :disabled="pagination.currentPage === 1">上一页</el-button>
                <span>{{ pagination.currentPage }} / {{ Math.ceil(pagination.total / pagination.pageSize) }}</span>
                <el-button @click="nextPage" :disabled="pagination.currentPage === Math.ceil(pagination.total / pagination.pageSize)">下一页</el-button>
                <span>共 {{ pagination.total }} 条记录</span>
              </div>
            </td>
          </tr>
        </template>
      </el-table>
    </div>
    <AddTask v-model="addTaskVisible" :type="action_type" @taskAdded="handleTaskAdded" :formData="rulesForm"  />
  </div>
</template>

<style scoped lang="less">
.abox{
  display: flex; 
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
}
</style>
