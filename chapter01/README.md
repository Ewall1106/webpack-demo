## webpack从0到1-开始
> 这系列文章就是手把手教你如何从零构建一个webpack项目。目的就是为了了解webpack打包怎么玩的，平常项目开发中所用如ES6语法、less、vue是如何被打包的，是一个比较基础的内容，我也是为了总结一下这方面的知识点，梳理一下个人的知识体系而写下这些文字。  
> 工具及版本：vscode、webpack(v4.41.5)、node(v10.16.0)  
> git仓库：[webpack-demo](https://github.com/Ewall1106/webpack-demo)

### 1、什么是webpack？
- **“webpack is a module bundler.”**—[webpack官网](https://webpack.js.org/)上打开自我介绍就是这句话，它是一个模块打包器。
- `webpack`是一个模块打包工具，可以打包js、图片资源啊等等，功能十分强大，但是在最开始的时候呢，`webpack`只是个js模块打包工具。现在就让我们回到webpack最初的模样，从怎么用它打包js文件开始。

### 2、初始化
- 即然从零开始，首先自然得从git仓库建立开始，怎么详细的从零建一个git仓库我有写过了([->传送门](https://www.jianshu.com/p/6deca2cfc37a))，这个系列文章代码所对应的git仓库：[webpack-demo](https://github.com/Ewall1106/webpack-demo)。

- 进入到webpack-demo下的chapter1中，输`npm init`初始化生成一个package.json文件。（这里一路回车下一步下一步就行，或者`npm init
-y`直接生成一个默认的文件）
```
$ cd webpack-demo/chapter1
$ npm init -y
```

- 新建一个`src`文件夹并在其中新建一个`index.js`文件：
```javascript
var div = document.createElement("div");
div.innerText = "hello world";

document.body.appendChild(div);
```

- 再新建一个html5标准格式的`index.html`文件:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>webpack从0到1</title>
</head>
<body>
    <script src="./src/index.js"></script>
</body>
</html>
```

- 这样我们基本的一个项目结构及内容就生成了，浏览器打开`index.html`文件也能显示出"hello world"。
```
  webpack-demo/chapter1
  |- package.json
+ |- index.html
+ |- /src
+   |- index.js
```

### 3、安装webpack
- 然后我们需要安装下`webpack`，可以全局安装也可以本地安装，我推荐本地安装，这样可以避免与他人合作开发时由于webpack版本号不一致而导致的打包问题。具体：[官网webpack安装](https://webpack.js.org/guides/installation/)
- 如果你没能绿色上网安装很慢的话可以使用[淘宝镜像](https://npm.taobao.org/)处理一下。

```
# 本地
$ npm install webpack webpack-cli --save-dev

# 全局
$ npm install webpack --global
```

- `--save-dev`和`--save`两个有啥子区别呢？
    - 后缀那个`--save-dev`可以简写为`-D`，这个会自动把模块和版本号添加到package.json中的`devDependencies`部分。
    - 还有一个后缀`--save`可以简写为`-S`，这个会自动把模块和版本号添加到`dependencies`部分。


> 在安装一个要打包到生产环境的安装包时，你应该使用`npm install --save`，如果你在安装一个用于开发环境的安装包（例如，linter, 测试库等），你应该使用`npm install --save-dev`。请在[npm文档](https://docs.npmjs.com/cli/install)中查找更多信息。  
> —— 引用来自[webpack官网教程](https://webpack.js.org/guides/getting-started/#creating-a-bundle)的解释。  
>   
> 还有我网上搜的另一个解释我也觉得很直观啊：  
> `--save-dev`是你开发时候依赖的东西，`--save`是你发布之后还依赖的东西。  
> 比如，你写ES6代码，如果你想编译成ES5发布那么babel就是`devDependencies`。如果你用了`jQuery`，由于发布之后还是依赖jQuery，所以是`dependencies`。  
> —— 引用[segmentfaul提问](https://segmentfault.com/q/1010000005163089)

- 安装完了以后我么就可以看到`package.json`中多出的这几行东西。
```
{
   ...
+  "devDependencies": {
+    "webpack": "^4.41.5",
+    "webpack-cli": "^3.3.10"
+  }
   ...
}
```



### 4、打包js
**（1）第一种方式--使用默认打包的模式**
- 我们可以直接在命令行中输入:
```
$ npx webpack
```
> 执行`npx webpack`，会将我们的`src/index.js`作为入口文件，然后会新建一个dist文件夹和`dist/main.js`作为输出文件。  
> `npx webpack`简单一点来说就是会去找项目中本地的`./node_modules/.bin/webpack`，然后中执行它。
- 这时我们就可以看到项目结构下生成了一个`dist`文件夹和打包好的`main.js`文件了。


**（2）第二种方式--使用配置文件打包**
- 删掉dist目录，在当前目录下新建一个`webpack.config.js`配置文件。
```
  webpack-demo/chapter1
  |- package.json
  |- index.html
  |- /src
    |- index.js
+ |- webpack.config.js
```

- 配置文件`webpack.config.js`中写：
```javascript
// 引入node中的path模块
const path = require('path');

module.exports = {
  // 定义入口文件，告诉webpack我要打包啥
  entry: './src/index.js',
  // 定义输出文件，告诉webpack打包好的文件叫啥，给我放到哪里
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

- 打包，使用`webpack-cli`提供的命令行（这就是我们为什么要安装webpack-cli的原因）：
```
$ npx webpack --config webpack.config.js
```

**（3）第三种方式--使用npm脚本**
- 上面使用`webpack-cli`命令打包的方式不够简洁明了，一般我们会在`package.json`中的`scripts`中定义一条命令。
```
{
...
+  "scripts": {
+    "build": "webpack"
+   }
...
}
```

- 打包，这个大家应该就很熟悉了，执行这条命令跟上面使用一样的效果，它会自动的去找文件目录下的`webpack.config.js`文件然后执行它。
```
$ npm run build
```

- 同样，这时我们就可以看到项目结构下生成了一个dist文件夹和打包好的main.js文件了。

### 5、最后
- 这时`src/index.js`文件已经通过webpack打包后输出为`dist/main.js`了，这个时候我们还得引用它，所以复制一份`index.html`文件到`dist`文件夹下。
```
  webpack-demo/chapter1
  |- package.json
  |- /dist
+   |- index.html
    |- main.js
  |- index.html
  |- /src
    |- index.js
```

- 将`dist/index.html`文件内容改为：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>webpack从0到1</title>
</head>
<body>
    - <script src="./src/index.js"></script>
    + <script src="main.js"></script>
</body>
</html>
```

- 这时候我们在浏览器中打开`dist/index.html`同样也可以看到`hello world`在屏幕中显示出来了，我们就简单了完成了一个js文件打包的过程。

### 6、其他
*参考链接*
- [Webpack 4 和单页应用入门](https://github.com/wallstreetcn/webpack-and-spa-guide)
- [git教学](https://www.jianshu.com/p/6deca2cfc37a)
- [webpack官网](https://webpack.js.org/guides/getting-started/#basic-setup)
