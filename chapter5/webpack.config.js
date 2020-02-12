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
  },

  // 使用loaders的列表
  module: {
    // 定义规则
    rules: [
      // 使用babel-loader处理es6语法
      {
        // 这是一个正则，所有以js结尾的文件都要给我过这里！！
        test: /\.js$/,
        // 除了node_modules下的（真香）
        exclude: /(node_modules|bower_components)/,
        // 使用babel-loader，options是它的一些配置项
        use: {
          loader: "babel-loader",
          // "@babel/preset-env"这个东西是babel提供给自己用的插件
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  // 添加polyfill
                  useBuiltIns: "usage",
                  corejs: { version: 3, proposals: true }
                }
              ]
            ]
          }
        }
      },
      // 使用file-loader处理文件
      // {
      //   test: /\.(png|svg|jpg|gif)$/,
      //   use: ["file-loader"]
      // },
      // 使用url-loader处理图片资源
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              // 当图片size小于limit值时会转为DataURL
              limit: 8192
            }
          }
        ]
      },
      // 处理css
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      // 处理sass
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader", // 将JS字符串生成为style节点
          "css-loader", // 将CSS转化成CommonJS模块
          "sass-loader" // 将Sass编译成CSS，默认使用Node Sass
        ]
      },
      // 处理less
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"]
      }
    ]
  }
};
