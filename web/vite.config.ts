/// <reference types="vitest" />

import path from 'path'
import { defineConfig } from 'vite'
import { viteVar } from 'vite-var'
import { getBuild, getPlugins } from './build/config'
import { globalVar } from './build/env/globalVar'
import { initLog } from './build/env/log'

// https://vitejs.dev/config/

initLog()
export default ({ mode, command }) => {
  const env = globalVar(mode)
  return defineConfig({
    base: './',
    plugins: getPlugins(env),
    css: { postcss: { plugins: [viteVar(env as any)] } },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@chat': path.resolve(__dirname, './src/modules/chat')
      }
    },
    server: {
      host: '0.0.0.0',
      port: env.port || 5100,
      headers:{ 'Access-Control-Allow-Origin': '*',},
      proxy: {
        '/api': {
          target: 'http://192.168.31.106:8089',
          secure: false, //请求是否为https
          changeOrigin: true, //是否为跨域
          rewrite: (path) => path.replace(/^\/api/, 'v1')
        }
      }
    },
    build: getBuild(env)
  })
}
