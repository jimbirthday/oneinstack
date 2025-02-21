export const Api = {
  /** 登录 */
  login: (obj?: any) => {
    console.log('Api.login', obj)
    return http.post('/login', obj)
  },
  /** 获取系统信息 */
  getSysinfo: () => {
    return http.get('/sys/info')
  },
  /** 获取监控信息 */
  getSysMonitor: () => {
    return http.get('/sys/monitor')
  },
  /** 获取备注信息 */
  getSysRemark: (id = 1) => {
    return http.get(`/sys/remark/${id}`)
  },
  /** 更新备注信息 */
  updateSysRemark: (obj: any) => {
    return http.post('/sys/remark/update', obj)
  },
  /** 获取网站统计 */
  getWebsiteCount: () => {
    return http.get('/sys/websitecount')
  },
  /** 获取数据库统计 */
  getDatabaseCount: () => {
    return http.get('/sys/libcount')
  },
  /** 获取文件列表 */
  getFileList: (obj: any) => {
    return http.post('/ftp/list', obj)
  },
  /** 创建文件或文件夹 */
  createFile: (obj: any) => {
    return http.post('/ftp/create', obj)
  },
  /** 删除文件或文件夹 */
  deleteFile: (obj: any) => {
    return http.post('/ftp/delete', obj)
  },
  /** 下载文件 */
  downloadFile: (obj: any) => {
    return http.post('/ftp/download', { ...obj, isBlob: true })
  },
  /** 修改文件权限 */
  updateFilePerm: (obj: any) => {
    return http.post('/ftp/modify', obj)
  },
  /** 获取软件列表 */
  getSoftList: (obj: any) => {
    return http.post('/soft/list', obj)
  },
  /** 安装软件 */
  installSoft: (obj: any) => {
    return http.post('/soft/install', obj)
  },
  /** 获取安装日志 */
  getInstallLog: (obj: any) => {
    return http.get('/soft/getlog', obj)
  },
  /** 获取软件运行状态 */
  getSoftRunState: (obj: any) => {
    return http.post('/soft/exploration', obj)
  },
  /** 获取网站列表 */
  getWebsiteList: (obj: any) => {
    return http.post('/website/list', obj)
  },
  /** 新增站点 */
  addWebsite: (obj: any) => {
    return http.post('/website/add', obj)
  },
  /** 更新站点 */
  updateWebsite: (obj: any) => {
    return http.post('/website/update', obj)
  },
  /** 删除站点 */
  delWebsite: (obj: any) => {
    return http.post('/website/del', obj)
  },
  /** 获取数据库列表 */
  getDatabaseList: (obj: any) => {
    return http.post('/storage/liblist', obj)
  },
  /** 获取远程服务器列表 */
  getConnlist: (obj: any) => {
    return http.get('/storage/connlist', obj)
  },
  /** 添加远程服务器 */
  addDatabaseConn: (obj: any) => {
    return http.post('/storage/addconn', obj)
  },
  /** 同步远程服务器 */
  syncDatabaseConn: (obj: any) => {
    return http.post('/storage/sync', obj)
  },
  /** 修改远程服务器 */
  updateDatabaseConn: (obj: any) => {
    return http.post('/storage/updateconn', obj)
  },
  /** 添加远程服务器 */
  addDatabaseLib: (obj: any) => {
    return http.post('/storage/addlib', obj)
  },
  /** 获取redis列表 */
  getRedisList: (obj: any) => {
    return http.post('/storage/rklist', obj)
  },
  /** 获取防火墙信息 */
  getFirewallInfo: (obj: any) => {
    return http.get('/safe/info', obj)
  },
  /** 获取防火墙规则 */
  getFirewallRule: (obj: any) => {
    return http.post('/safe/rules', obj)
  },
  /** 启动/禁用ping */
  openPing: (obj: any) => {
    return http.post('/safe/blockping', obj)
  },
  /** 启动/禁用防火墙 */
  stopFirewall: (obj: any) => {
    return http.post('/safe/stop', obj)
  },
  /** 删除防火墙规则 */
  deleteSale: (obj: any) => {
    return http.post('/safe/del', obj)
  },
  /** 添加防火墙规则 */
  addFirewallRule: (obj: any) => {
    return http.post('/safe/add', obj)
  },
  /** 修改防火墙规则 */
  updateFirewallRule: (obj: any) => {
    return http.post('/safe/update', obj)
  },
  /** 获取计划任务列表 */
  getPlanTaskList: (obj: any) => {
    return http.post('/cron/list', obj)
  },
  /** 新增计划任务 */
  addPlanTask: (obj: any) => {
    return http.post('/cron/add', obj)
  },
  /** 启用计划任务 */
  enablePlanTask: (obj: any) => {
    return http.post('/cron/enable', obj)
  },
  /** 禁用计划任务 */
  disablePlanTask: (obj: any) => {
    return http.post('/cron/disable', obj)
  },
  /** 删除计划任务 */
  deletePlanTask: (obj: any) => {
    return http.post('/cron/del', obj)
  },
  /** 更新计划任务 */
  updataPlanTask: (obj: any) => {
    return http.post('/cron/del', obj)
  },
  /** 获取系统信息/面板设置 */
  getSystemInfo: () => {
    return http.get('/sys/systeminfo')
  },
  /** 更新系统信息/修改端口*/
  updatePort: (obj: any) => {
    return http.post('/sys/updateport', obj)
  },
  /** 修改标题 */
  updateSystemTitley: (obj: any) => {
    return http.post('/sys/updatesystemtitle', obj)
  },
  /** 更新用户密码 */
  updateResetpassword: (obj: any) => {
    return http.post('/sys/resetpassword', obj)
  },
  /** 更新用户账号 */
  updateUpdateuser: (obj: any) => {
    return http.post('/sys/updateuser', obj)
  },
  /** 获取基础信息 */
  getBaseInfo: () => {
    return http.get('/sys/getbaseinfo')
  }
}
