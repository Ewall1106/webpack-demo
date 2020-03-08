const merge = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const prodConfig = {
  // 打包的模式：development/production
  // development模式下不会压缩代码、便于查看，也不会做一些其它性能上优化
  // 反之production模式会做一些压缩等相应的处理
  mode: "production",

  // 开启sourceMap
  // development模式下可设置为inline-source-map或者source-map
  // production模式下可设置为cheap-module-source-map
  devtool: "cheap-module-source-map",

  // 代码分割codeSpliting
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },

  // 使用loaders的列表
  module: {
    // 定义规则
    rules: [
      // 处理css
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
      },
      // 处理sass
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader, // 将JS字符串生成为style节点，并做css代码分割
          "css-loader", // 将CSS转化成CommonJS模块
          "postcss-loader", // 处理css-如结合autoprefixer自动添加浏览器前缀之类的
          "sass-loader" // 将Sass编译成CSS，默认使用Node Sass
        ]
      },
      // 处理less
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "less-loader"
        ]
      }
    ]
  },

  // 使用plugins的列表
  plugins: [
    // css文件的代码分割
    new MiniCssExtractPlugin()
  ]
};

module.exports = merge(commonConfig, prodConfig);

