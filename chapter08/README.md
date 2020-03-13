## webpack从0到1-基本的plugins
> 谈谈plugins，然后使用两个基本的plugins，一个是clean-webpack-plugin，一个是HtmlWebpackPlugin。  
> git仓库：[webpack-demo](https://github.com/Ewall1106/webpack-demo)

### 1、plugins初识
- 什么是`webpack`的[plugins](https://webpack.js.org/concepts/plugins/)？首先回顾一下前面几章讲`webpack`的`loaders`相关概念时，我将它理解为一个**赋能**的概念，各种各样的`loader`为`webpack`提供了处理不同文件的能力，使`webpack`变得更强大了。

- 而`webpack`的`plugins`，则可以把它理解为类似于框架的**生命周期(钩子/函数)**，比如可以在页面`mounted`的时候做些事情、在页面`show`的时候做些事情，离开页面`destroyed`的时候做些事情等等。同理，`plugins`也可以让我们在`webpack`打包过程中的不同阶段来做些事情。

- 大概感觉就是这么个感觉，具体我们实践出真章。

### 2、过程回顾
- 首先我们回顾下我们打包or重新打包的一个大体的过程啊：
    - ①我们先会手动删除掉`dist`文件夹，避免再次打包有冗余重复的js文件；
    - ②复制一份`src/index.html`到`dist`目录下；
    - ③`npm run build`打包；
    - ④假设打包后输出的文件为`main.bundle.js`，那么则将此文件在`dist/index.html`中手动引入；
    - ⑤打包完成，`dist`文件更新完成。

- 接下来呢，我们就利用插件解决上面手动化的处理过程。复制一份chapter7的文件改名为`chapter8`。

### 3、CleanWebpackPlugin
- 首先我们来解决上文中的第①个步骤，使用`CleanWebpackPlugin`这个插件可以帮我们实现这个功能，他会自动帮我们删除`dist`文件，安装：
```
$ npm install clean-webpack-plugin --save-dev
```

- 在`webpack.config.js`中引入并配置它。
```javascript
+  const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: {
       main: "./src/index.js"
    },
    output: {
       filename: "[name].bundle.js",
       path: path.resolve(__dirname, "dist")
    },
+   plugins: [
+      new CleanWebpackPlugin()
+   ],
    ...
}
```

- 当我们重新打包的时候，这个插件就会帮我们把`dist`文件，在`webpack`中使用一个插件就是这么简单。


### 4、HtmlWebpackPlugin
- 首先，我们安装这个插件，并试着使用它。安装：
```
$ npm install html-webpack-plugin --save-dev
```

- 在webpack.config.js中配置添加一下：
```javascript
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
+  const HtmlWebpackPlugin = require("html-webpack-plugin");

const path = require("path");

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: {
       main: "./src/index.js"
    },
    output: {
       filename: "[name].bundle.js",
       path: path.resolve(__dirname, "dist")
    },
    plugins: [
       new CleanWebpackPlugin(),
+      // 可以为你生成一个HTML文件
+      new HtmlWebpackPlugin()
    ],
    ...
}
```

- 当我们这么简单的添加一行后，开始打包，这个插件会为我们做两件事情：
    - 在`dist`目录下生成一个`index.html`文件；
    - 自动帮我们引入`main.bundle.js`文件;


### 5、小进阶
-  这个`html-webpack-plugin`插件还有一些的基本的常见配置，我们可传个对象给它配置些东西。
    - 设置这个`template`就是说，打包后我不要它自动给我生成一个html文件，我指定一个模板，你照着这个模板把`main.bundle.js`文件引入就行。
    - 设置`title`就是测试一下，`<%= htmlWebpackPlugin.options %>`可以读取`htmlWebpackPlugin`中定义的配置参数。
    - 这是两个比较常见的设置场景。
```javascript
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
+  const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    ...
    plugins: [
       new CleanWebpackPlugin(),
       // 可以为你生成一个HTML文件
       new HtmlWebpackPlugin({
+        title: "webpack从0到1",
+        template: "./index.html"
       })
    ],
    ...
}
```

- 修改一下我们许久未动的`chapter8/index.html`文件。
```html
<!DOCTYPE html>
<html lang="en">

<head>
     <meta charset="UTF-8">
-    <title>webpack从0到1</title>
+    <title><%= htmlWebpackPlugin.options.title %></title>
</head>

<body>
-    <script src="./src/index.js"></script>
</body>

</html>
```

- 打包后，我们就可以看到新的`dist/index.html`文件自动生成了：
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>webpack从0到1</title>
</head>

<body>
<script type="text/javascript" src="main.bundle.js"></script>
</body>

</html>
```

### 小结
- 当我们每次重新打包，如果有新的文件输出，那么就会直接添加到dist文件夹下，循环往复下去，我们的dist目录就会变得很混乱，所以，我们需要在每次重新打包前把dist目录手动删除一下，`clean-webpack-plugin`这个插件就是来帮我们做这个事情的。
- `html-webpack-plugin`可以帮我们自动生成一个html文件，也可以指定一个html文件为模板，自动引入打包后的文件等等。
- 其实，如果我们自己去[写一个plugin](https://webpack.js.org/contribute/writing-a-plugin/)就会知道，里面的内容就是利用了`webpack`提供的[事件钩子](https://webpack.js.org/contribute/writing-a-plugin/)，当打包进行某个阶段的时候做了些相应的事情，做完了就`callback`回调一下而已。
- 上文**过程回顾**中的几点步骤，我们基本靠这两个插件解决了，但是第三步每次修改文件内容后都需要重新`npm run build`打包一下这个很烦，下节我们用[webpack-dev-server](https://github.com/webpack/webpack-dev-server)这个插件来解决这个问题。

*参考链接：*  
[webpack-html-webpack-plugin](https://webpack.js.org/plugins/html-webpack-plugin/)  
[html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin#configuration)  
[output-management](https://webpack.js.org/guides/output-management/)  



