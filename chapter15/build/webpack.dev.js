const merge = require("webpack-merge");
const commonConfig = require("./webpack.common.js");

const devConfig = {
  // 打包的模式：development/production
  // development模式下不会压缩代码、便于查看，也不会做一些其它性能上优化
  // 反之production模式会做一些压缩等相应的处理
  mode: "development",

  // 开启sourceMap
  // development模式下可设置为inline-source-map或者source-map
  // production模式下可设置为cheap-module-source-map
  devtool: "source-map",

  // 配置Server
  devServer: {
    contentBase: "./dist",
    port: "8080",
    open: true,
    hot: true,
    hotOnly: true,
    proxy: {
      "/v2": {
        // 带有"/v2"的接口代理到请求target这个服务器，就相对于请求"http://douban.uieee.com/v2/movie/top250?start=25&count=25"
        target: "http://douban.uieee.com",
        // 可以把请求接口中的某部分重写
        pathRewrite: { "^/v2": "/v2" },
        // 允许https
        secure: false,
        // 允许跨域
        changeOrigin: true
      }
    }
  },

  // 使用loaders的列表
  module: {
    // 定义规则
    rules: [
      // 处理css
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"]
      },
      // 处理sass
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader", // 将JS字符串生成为style节点，并做css代码分割
          "css-loader", // 将CSS转化成CommonJS模块
          "postcss-loader", // 处理css-如结合autoprefixer自动添加浏览器前缀之类的
          "sass-loader" // 将Sass编译成CSS，默认使用Node Sass
        ]
      },
      // 处理less
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"]
      }
    ]
  }
};

module.exports = merge(commonConfig, devConfig);
