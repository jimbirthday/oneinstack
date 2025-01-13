package server

import (
	"log"
	"oneinstack/app"
	"oneinstack/internal/services/software"
	"oneinstack/internal/services/system"
)

// 用作启动后端持久化服务&初始化服务
func Start() {
	app.Viper()
	if err := app.InitDB("myadmin.db"); err != nil {
		log.Fatal("InitDB error:", err)
	}
	go system.SystemMonitor()
	go software.Sync()
}
