const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

// 引入node中的path模块
const path = require("path");

module.exports = {
  // 定义入口文件，告诉webpack我要打包啥
  entry: {
    main: "./src/index.js"
  },

  // 定义输出文件，告诉webpack打包好的文件叫啥，给我放到哪里
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "../dist")
  },

  // 解析：https://webpack.docschina.org/configuration/resolve/
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": path.resolve(__dirname, "../src")
    }
  },

  // 使用loaders的列表
  module: {
    // 定义规则
    rules: [
      // 处理.vue文件
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
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
                  corejs: { version: 3, proposals: true },
                  // 禁止将import/export转为require写法
                  modules: false
                }
              ]
            ]
          }
        }
      },
      // 使用file-loader处理文件
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      },
      // 使用url-loader处理图片资源
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              // 当图片size小于limit值时会转为DataURL
              limit: 4096,
              // fixed:https://github.com/vuejs/vue-loader/issues/1612
              esModule: false
            }
          }
        ]
      }
    ]
  },

  // 使用plugins的列表
  plugins: [
    // 打包前删除掉dist文件避免文件冗余重复
    new CleanWebpackPlugin(),
    // 可以为你生成一个HTML文件
    new HtmlWebpackPlugin({
      title: "webpack从0到1",
      template: "./index.html"
    }),
    // 处理vue
    new VueLoaderPlugin()
  ]
};
