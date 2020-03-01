// 引入node中的path模块
const path = require("path");

module.exports = {
  // 打包的模式：development/production
  // development不会压缩代码、便于查看，也不会做一些其它性能上优化，反之production模式会做处理。
  mode: "development",
  // 定义入口文件，告诉webpack我要打包啥
  entry: "./src/index.js",
  // 定义输出文件，告诉webpack打包好的文件叫啥，给我放到哪里
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  }
};
