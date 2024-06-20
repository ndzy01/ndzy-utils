import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
  plugins: [react(), dts()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: "src/index.ts", // 组件库入口文件
      name: "NDZYLibrary",
      formats: ["es", "umd"], // 输出格式
      fileName: "index",
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["react", "react-dom"],
      output: {
        // 为全局变量提供一个名称，在UMD格式中使用
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
})
