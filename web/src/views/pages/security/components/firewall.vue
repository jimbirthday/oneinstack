<script setup lang="ts">
import SearchInput from '@/components/search-input.vue'
import { ref, reactive } from 'vue'
import { Api } from '@/api/Api'
import { onMounted } from 'vue'
import Addfirewall from './addfirewall.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Scope } from 'tools-vue3'


const addRulemodal = ref(false)
const exportRulemodal = ref(false)
const keyNum = ref(0)
const wall_value = ref(false)
const ping_value = ref(false)
const isAdd = ref(true)
const currentRow = ref({})



const tableData = ref([])
const handleAdd = () => {
  isAdd.value = true
  currentRow.value = {}
  addRulemodal.value = true
  keyNum.value++
}
const exportClick = () => {
  exportRulemodal.value = true
  keyNum.value++
}
const oncloseRule = (value: boolean) => {
  addRulemodal.value = value
  keyNum.value++
  if (!value) {
    getData()
  }
}
const oncloseExport = (value: boolean) => {
  exportRulemodal.value = value
  keyNum.value++
}
const filterDirection = ref('')
const handleAllDirection = (value: string) => {
  filterDirection.value = value
  pagination.currentPage = 1  // 重置页码
  getData()
}
const timer = Scope.Timer()
const dialog = reactive({
  show: false,
  content: '',
  onClose: () => {
    timer && timer.clear()
  }
})
const handleOpenPing =async (value: string) => {
  console.log(value,'value')
  if(value === 'ping'){
    const { data: res_wall} = await Api.openPing('')
    console.log(res_wall,'res_wall')
    if (res_wall){
      let ping_val = !ping_value.value
      ping_value.value = !ping_val
    }
   
  }else{
    const { data: res_ping } = await Api.stopFirewall('')
    if(res_ping) {
      let wall_val = !wall_value.value
      wall_value.value = !wall_val
    }
   
  }
}
let searchValue = ref('')
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const getList = () => {}
const onSubmit = () => {
  console.log('submit!')
}
const handleDelete = async (row: any) => {  
  try {
    await ElMessageBox.confirm('确认要删除该数据吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const { data: res } = await Api.deleteSale({id: row.id})
    if (res) {
      ElMessage.success('删除成功')
      getData()  // 删除成功后刷新数据
    } else {
      ElMessage.error('删除失败')
    }
  } catch (error) {
    // 用户取消删除或发生错误时不做处理
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}
const handleSet = (row: any) => {
  isAdd.value = false
  currentRow.value = { ...row }
  addRulemodal.value = true
  keyNum.value++
}
const getData = async () => {
  try {
    const { data: res } = await Api.getFirewallRule({
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      direction: filterDirection.value,
      q: searchValue.value
    })
    console.log(res, 'res')
    if (res ) {  // 确保请求成功
      tableData.value = res.data  ? res.data :[] // 更新表格数据
      pagination.total = res.total || 0  // 更新总数
    } else {
      ElMessage.error(res?.message || '获取数据失败')
    }
  } catch (error) {
    ElMessage.error('获取数据失败')
    tableData.value = []
    pagination.total = 0
  }
}
const getFirewallInfo = async () => {
  const { data: res } = await Api.getFirewallInfo({})
  wall_value.value =res.info.enabled ? res.info.enabled : false
  ping_value.value =res.info.pingBlocked ? res.info.pingBlocked : false
}

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
  getData()
}

onMounted(() => {
  getData()
  getFirewallInfo()
})
</script>

<template>
  <div>
    <div class="box1">
      <div class="flex justify-between items-center">
        <div>
          <span>防火墙开关</span>
          <el-switch v-model="wall_value" class="ml-2"  @change="handleOpenPing('wall')"/>
        </div>
        <div style="margin-inline: 60px 150px">
          <span>禁ping</span>
          <el-switch v-model="ping_value" class="ml-2"  @change="handleOpenPing('ping')"/>
        </div>
        <!-- <div class="webLog">
          Web日志：
          <span class="mr-2" style="color: var(--el-color-primary)">/www/wwwlogs</span>
          5.20MB
        </div> -->
      </div>
      <!-- <el-button>清空</el-button> -->
    </div>
    <div class="tool-bar">
      <el-space class="btn-group">
        <el-button type="primary" @click="handleAdd">添加端口规则</el-button>
        <!-- <el-button type="primary" @click="exportClick">导入规则</el-button>
        <el-button type="primary" @click="exportClick">导出规则</el-button> -->
        <el-button-group>
          <el-button type="primary" @click="handleAllDirection('')">所有方向</el-button>
          <el-button type="primary"  @click="handleAllDirection('in')" >入站</el-button>
          <el-button type="primary"  @click="handleAllDirection('out')">出站</el-button>
        </el-button-group>
      </el-space>
      <div class="demo-form-inline">
        <search-input placeholder="请输入关键词进行搜索" v-model="searchValue" @search="getData" />
      </div>
    </div>
    <div class="box2">
      <!-- <div class="miscellaneous">
        <div>端口规则：2</div>
        <div>端口转发：0</div>
        <div>地区规划：0</div>
        <div>IP规则：0</div>
      </div> -->
      <el-table :data="tableData" border style="width: 100%" empty-text="暂无数据" :row-key="(row) => row.id">
        <el-table-column prop="direction" label="方向" width="100">
          <template #default="scope">
            <div style="display: flex; flex-direction: row; align-items: center; cursor: pointer">
              <el-tag type="primary"  v-if="scope.row.direction == 'in'">输入</el-tag>
              <el-tag type="warning"  v-if="scope.row.direction == 'out'">输出</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="protocol" label="协议" width="120" />
        <el-table-column prop="state" label="状态" width="120">
          <template #default="scope">
            <div style="display: flex; flex-direction: row; align-items: center; cursor: pointer">
              <a style="color: #64ffc9; text-decoration: underline" v-if="scope.row.state === 1">运行中</a>
              <a style="color: #ff8888; text-decoration: underline" v-if="scope.row.state === 0">已停用</a>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ports" label="端口"  width="180" />
        <el-table-column prop="strategy" label="策略类型" />
        <el-table-column prop="ips" label="来源" />
        <!-- <el-table-column prop="remark" label="备注" /> -->
        <!-- <el-table-column prop="create_time" label="时间" /> -->
        <el-table-column prop="action" label="操作">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleSet(scope.row)">设置</el-button>  
            <el-button link type="primary" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          background
          layout="total, prev, pager, next"
          :total="pagination.total"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>

  <Addfirewall 
    v-model="addRulemodal" 
    @close="oncloseRule" 
    style="padding: 20px;" 
    :key="keyNum" 
    v-if="addRulemodal"
    :type="isAdd"
    :formData="currentRow"
  />
</template>

<style scoped lang="less">
.miscellaneous {
  width: 100%;
  height: 60px;
  background: rgba(var(--category-item-bg-color), 0.6);
  border-radius: 4px;
  margin-bottom: 12px;
  padding-inline: 26px;
  display: flex;
  align-items: center;
  gap: 98px;
  color: var(--font-color-black);
  font-size: 14px;
}
</style>
