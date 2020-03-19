## webpack从0到1-HMR（热模块更新）
> 说下热模块更新这个时常被谈到的问题，工作中也比较常见到、面试中也比较常问到的问题。  
> git仓库：[webpack-demo](https://github.com/Ewall1106/webpack-demo)

### 1、HMR
- `HMR`(Hot Module Replacement)也就是热模块更新，是用来干什么的呢？就是你可以实时的更新某个状态而浏览器不重新刷新。
- 举个具体的例子可能就理解了啊，比如我们现在要把一个`div`块的颜色从白色改为黑色，最直接方便的办法是怎样？不是去编辑器里面改代码，然后等浏览器`refresh`这样去看效果；而是直接打开调试着工具，改一下它的颜色就可以看到效果了。
- 使用第一种方式会有点问题，假设你这个`div`块默认隐藏的，是需要某个点击步骤后才能展示，你改代码导致浏览器`refresh`后破坏了这个状态，那么就还需要还原前置的点击操作，才能看到效果。
- 极端一点，现在我要看这个`div`块的颜色变为黑色的效果，而要让它show前置化操作就需要点击一百次操作，你说你好不容易点了一百次才让这个`div`块的显示了，结果你改下编辑器里面的代码，浏览器重刷新了，又要来一遍，你说就看个颜色的效果怎么就这么难？
- 啰嗦了这么多，回到开头，`HMR`这个东西就是可以让你在代码编辑器里面把白色改为黑色后，而浏览器不会重刷新。
- 当然，上面这么多都是我自己的理解，`HMR`是帮助你提高开发效率的，其实吧，我觉得并没有什么卵用，至少是没有很大的作用吧，可能我业务开发涉及的页面比较菜吧，切图的时候浏览器你爱重刷新就重刷新，只要别跟微信开发者工具一样有时候改了代码却不刷新就行。。。那就卧槽了。。。

### 2、设置
- 设置它需要结合`webpack`中的`devSever`这个配置项，前面chapter10讲过这部分内容。[--> 10、webpack从0到1-devServer之数据请求](https://github.com/Ewall1106/webpack-demo/tree/master/chapter10)

- 配置`devServer`的参数`hot:true`，这就表示开启了热模块更新了。
```javascript
module.exports = {
// ...
  // 配置Server
  devServer: {
    contentBase: "./dist",
    port: "8080",
    open: true,
+   hot: true,
  },
// ...
}
```

- 然后有很多以前的文章中都会说需要引入一个插件，一个webpack自带的`HotModuleReplacementPlugin`插件，比如此刻的[webpack中文文档](https://www.webpackjs.com/guides/hot-module-replacement/)demo就是这样演示的，但是你去看英文最新的文档就会发现，当你设置了`hot:true`以后，这个插件就会自动引入了，完全不用配置这步骤了，中文文档还是有点落后的，不过问题不大。
![]((https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter14_1.png))

- 如果你有自己有按照我的来demo来编写，那么到了这里会发现HRM没效果，为啥？因为我们[上一章](https://github.com/Ewall1106/webpack-demo/tree/master/chapter13)对css做了代码分割，使用了`MiniCssExtractPlugin`这个插件代替了`style-loder`，而css的热模块更新是需要`style-loader`这个东西配合的，所以需要把设置css代码分割的内容删掉。
```javascript
- const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
// ...
  devServer: {
    contentBase: "./dist",
    port: "8080",
    open: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
-         MiniCssExtractPlugin.loader, 
+         "style-loader",
          "css-loader", 
          "postcss-loader"
        ]
      },
    ]
  }
// ...
}
```

- 这里只演示删除关于css的，`less`、`sass`和`plugins`里面处理代码分割的东西都要删除替换。然后我们改个颜色来演示下`HRM`的作用，你会看到浏览器没有refresh而颜色变化了。

| 默认状态 | 点击body生成footer | 编辑器中将其修改为骚粉 |
| --- | --- | --- |
| ![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter14_2.png)| ![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter14_3.png) | ![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter14_4.png) |

### 3、原理
- 虽然我们现在配合`webpack-dev-server`这个插件，设置个`hot:true`就可以开启HRM了,webpack会自动帮我们引入`HotModuleReplacementPlugin`这个插件，所以，`HRM`的实现肯定是和这两个插件有关的。
- 大概讲下这个过程：
    1. 首先通过webpack-dev-server插件起了一个服务器，建立起了客户端与服务端的通信，将打包编译后的dist文件放到了内存中，这个前面讲过；
    2. 当我们第一次打包编译的时候`hot-module-replacement-plugin`这个插件会生成一个`hotModuleReplacement.runtime.js`文件并注入到主文件`main.bundle.js`中，里面就是一些逻辑相关的啊、回调函数啥的，大概可以这么理解。
    3. 然后当我们改变代码，再次重新打包编译的时候，会看到有一些`xxx.hot-update.js`的文件产生，这是前提；
    ![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter14_5.png)
    4. 文件改变了，这个时候服务端server会通知客户端：老哥，我这里有情况！！！
    5. 当我们的客服端收到这个消息时，`hotModuleReplacement.runtime.js`里面的方法会开始执行了，他会向服务端`ajax`发送请求，然后服务端就会把这个包含了更新信息的`xxx.hot-update.js`交给客户端。
    6. 客户端通过结合`hot-update.js`文件就知道哪里变了，然后就会去局部的更新代码。
 ![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter14_6.png)
- 以上是我的理解可能有误区，文末贴了大佬的文章链接，自己去看看吧。

### 4、小结
- 好吧。。我发现它还是有点用的，收回我开头说的HMR没什么卵用那句话。
- 通过本章配置HRM我们可以知道，HRM是不能和代码分割一起存在的，HRM只存在于开发环境中，代码分割只需存在于生产环境中，所以下章就把它们分开，各自安好吧。
*参考链接：*  
[https://zhuanlan.zhihu.com/p/30623057](https://zhuanlan.zhihu.com/p/30623057)  
[https://juejin.im/post/5de0cfe46fb9a071665d3df0](https://juejin.im/post/5de0cfe46fb9a071665d3df0)  
[https://webpack.js.org/concepts/hot-module-replacement/](https://webpack.js.org/concepts/hot-module-replacement/)


