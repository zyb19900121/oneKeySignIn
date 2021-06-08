/*
 * @Author: zhangyanbin
 * @Date: 2021-06-08 10:23:21
 * @LastEditors: zhangyanbin
 * @LastEditTime: 2021-06-08 11:17:37
 * @Description: file content
 */
import { defineConfig } from "umi";

export default defineConfig({
  base: "./",
  publicPath: "./",
  hash: true,
  history: {
    type: "hash",
  },
  outputPath: `/dist/renderer`,
  nodeModulesTransform: {
    type: "none",
  },
  routes: [{ path: "/", component: "@/pages/index" }],
  fastRefresh: {},
});
