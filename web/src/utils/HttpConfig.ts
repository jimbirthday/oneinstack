import { EKey } from '@/enum/Enum'
import sconfig from '@/sstore/sconfig'
import { globalType } from '../../build/env/globalVar'
import System from './System'
import { HttpCode } from '@/enum/HttpCode'

export default class HttpConfig {
  static init(env: globalType) {
    //#ifvar-dev
    let apiurl = StrUtil.getParam(location.href).apiurl
    if (!apiurl) apiurl = Cookie.get(EKey.apiurl)
    if (apiurl) {
      Cookie.set(EKey.apiurl, apiurl)
    }
    //#endvar

    const funrun = (obj: any, fields: string[], ...data: any) => {
      fields.forEach((field) => {
        if (obj[field]) obj[field](...data)
      })
    }

    const error = (_code: number, config: any, xhr: any) => {
      let code = xhr?.data?.code || _code,
        msg = xhr?.data?.message || ''
        
      funrun(config.data, ['final', 'fail', 'complete'], _code == 200, config, xhr)
      switch (code) {
        case HttpCode.LOGIN_EXPIRED:
          System.er(msg, { type: 'error' })
          sconfig.logout(true)
          break
        case HttpCode.NETWORK_ERROR:
          System.er('网络异常，请稍后再试', { type: 'error' })
          break
        case HttpCode.REQUEST_TIMEOUT:
          System.er('请求超时，请稍后再试', { type: 'error' })
          break
        default:
          System.er(msg, { type: 'error' })
          break
      }
    }
    http.setConfig({
      base: env.API,
      headers: {
        'Authorization': 'Basic c2FiZXI6c2FiZXJfc2VjcmV0'
      },
      before(config) {
        config.param.headers = config.param.headers || {}

        //#ifvar-dev
        config.param.headers[EKey.apiurl] = apiurl
        //#endvar

        Object.keys(config.data).forEach((key) => {
          const _str = config.data[key] + ''
          if (_str == 'undefined' || _str == 'null') {
            delete config.data[key]
          }
        })
        const token = sconfig.userInfo?.token
        const currentPath = System.getRouterPath()
        if (!token && !currentPath.includes('/login')) return System.router.replace('/login')
        token && (config.param.headers.Authorization = `Bearer ${token}`)
        if (config.data?.json) {
          config.param.headers['Content-Type'] = 'application/json'
          delete config.data.json
        }
      },
      after(xhr, config) {
        if (config.data?.isBlob) {
          const blob = new Blob([xhr.data], { type: 'application/octet-stream' })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.style.display = 'none'
          a.href = url
          a.download = config.data.filename
          a.click()
          window.URL.revokeObjectURL(url)
        }
        const { code } = xhr.data
        if (code === undefined) return
        if (code != 0) {
          error(code, config, xhr)
          throw new Error(code)
        }
        funrun(config.data, ['final', 'success', 'complete'], xhr.data, config, xhr)
      },
      error
    })
  }
}
