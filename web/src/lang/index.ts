import { EKey } from '@/enum/Enum'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'en-us',
  messages: {}
})

export const langobj: any = {
  'en-us': 'US', //英语
  'hi-IN': 'IN', //印地语
  'th-TH': 'TH', //泰语
  'id-ID': 'IDN', //印度利西亚语
  'pt-PT': 'PT', //葡萄牙语
  'es-ES': 'ES' ,//西班牙语
  'es-CH': 'CH' //中文
}

//@ts-ignore
i18n.setLang = async (lang: string = Cookie.get(EKey.language) || 'en-us') => {
  const modules = import.meta.glob('@/lang/**/*.ts')
  const module: any = await modules[`/src/lang/${lang}.ts`]()
  i18n.global.setLocaleMessage(lang, module.default)
  i18n.global.locale = lang
  //@ts-ignore
  i18n.locale = lang
  Cookie.set(EKey.language, lang)
}

//@ts-ignore
i18n.t = i18n.global.t

//@ts-ignore
i18n.locale = 'es-CH'

export default i18n as any as {
  [key: string]: any
  /** 翻译 */
  t: (name: string) => any
  /** 设置语言 */
  setLang: (lang?: string) => Promise<void>
  /** 当前语言 */
  locale: string
}
