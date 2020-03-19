## webpack从0到1-css代码分割
> 前面[chapter11](https://github.com/Ewall1106/webpack-demo/tree/master/chapter11)介绍了js的代码分割，本章说下css的代码分割如何弄。  
> git仓库：[webpack-demo](https://github.com/Ewall1106/webpack-demo)

### 1、开始
- 前面[chapter11章](https://github.com/Ewall1106/webpack-demo/tree/master/chapter11)`CodeSplitting`的时候已经讲过代码分割的概念了，是个什么东西，但那是对js模块做代码分割，这节说下css的代码分割。
- 主要借助的就是一个插件：[MiniCssExtractPlugin](https://webpack.js.org/plugins/mini-css-extract-plugin/)，还是沿用我们以前的代码，我们先来安装一下。
```
$ cd chapter13
$ npm install mini-css-extract-plugin --save-dev 
```

### 2、配置
- 这是一个插件，并没有集成到`webpack`中，不像前面12章设置`CodeSplitting`那样加个`optimization`属性搞一下就好了，这里我们要走如何使用一个插件的流程。
- 进入到`webpack.config.js`中：
    - 首先我们需要在开头`require("mini-css-extract-plugin")`引入这个插件；
    - 其次我们需要在`plugins`中使用它；
    - 然后我们需要把`style-loader`都替换为这个插件提供的`MiniCssExtractPlugin.loader`。（我这里示例只是替换了处理css的，其他less和sass的处理loader一样也要替换，具体看git仓库源码吧）

```javascript
// ...
+ const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // ...
  module: {
    rules: [
      // 处理css
      {
        test: /\.css$/,
        use: [
-        "style-loader", 
+        MiniCssExtractPlugin.loader,
         "css-loader", 
         "postcss-loader"
        ]
      },
    ]
  },

  plugins: [
    // 打包前删除掉dist文件避免文件冗余重复
    new CleanWebpackPlugin(),
    // 可以为你生成一个HTML文件
    new HtmlWebpackPlugin({
      title: "webpack从0到1",
      template: "./index.html"
    }),
    // css文件的代码分割
+   new MiniCssExtractPlugin()
  ]
};
```

- 就这样，基本的css代码分割就完事了，虽然比js的代码分割复杂一点，但是也还好，接下来就`npm run build`走一波。

### 3、分析一波
- 最后，当我们打包完成了以后就可以看到dist目录下多出的css文件了。（分割出来了）
![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter13_1.png)

- 现在整个`dist`目录有点乱了，我们在回顾并说明介绍一下各个文件吧。
    - 所有`.map`文件就不多说了，`sourcemap`的映射。
    - 首先是`0.bundle.js`文件，是[webpack从0到1-Prefetching/Preloading]()章的产物，在示例中因为我们使用`import()`方法动态的加载了`footer.js`模块，所以webpack对其进行了代码分割。
    - 接下来是`vendors~main.bundle.js`文件，因为它也是webpack对其代码分割生成生的，是[webpack从0到1-CodeSplitting代码分割]()章节的产物，里面是axios的js代码，为什么与`0.bundle.js`没有合并到一起呢？因为`axios`的引入是在`node_modules`里面的，它们的引入方式对应两个不同的缓存组，所以分割为了两个文件。
    - `index.html`是`HtmlWebpackPlugin`这个插件做的好事罗。
    - `main.bundle.js`就是webpack中定义的`output`指定输出文件了。
    - `main.css`就是我们这章说的css代码分割的产物了。
    
### 4、小结
- 内容就这么多，官网还是要看一看。
*参考链接*  
[MiniCssExtractPlugin](https://webpack.js.org/plugins/mini-css-extract-plugin/)