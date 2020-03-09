## webpack从0到1-使用babel打包

> 讲下webpack中的loaders的概念，然后结合使用babel-loader来对项目中的es6语法做下转换。      
> git仓库：[webpack-demo](https://github.com/Ewall1106/webpack-demo)


### 1、什么是loaders？
- 先看官网对[Loaders](https://webpack.js.org/loaders/)的解释：**webpack enables use of loaders to preprocess files**。
- 简单一点来说就是一个可以帮我们处理文件的东西，比如一个js文件，在webpack打包的时候看到这个js文件就会走我们定义的比如接下来要说的`babel-loader`，给它转化一下，然后吐出来的就是一个纯es5语法的js文件了，大概就是起了这么一个作用。
- 所以呢，就有很多的`loader`，用来处理图片的`file-loader`，用来处理css文件的`style-loader`，`file-loader`也可以处理excel文件啊等等。

### 2、安装babel
- 接着上章来，复制一封chapter2的文件重命名为`chapter3`,进入该目录，开始安装babel。其实你可以照着去[babel官网](https://babeljs.io/setup#installation)照着它的安装教程来啊（使用场景选webpack），我这边其实就是再复述一遍过程。
```
$ cd chapter3
$ npm install babel-loader @babel/core @babel/preset-env --save-dev
```

- 这样我们的`package.json`中的依赖就增加了这么几行，这样我们就安装成功了。
```
{
...
 "devDependencies": {
+   "@babel/core": "^7.8.4",
+   "@babel/preset-env": "^7.8.4",
+   "babel-loader": "^8.0.6",
    "webpack": "^4.41.5",
    "webpack-cli": "^3.3.10"
  }
...
}
```

### 3、使用babel打包
- ok，然后进入到我们的`webpack.config.js`文件中，接下来我们要将`babel-loader`添加到module的loaders列表中。
- 不要问为什么要这么写，webpack就是这样定义的，这就是它使用loader的格式。不信你可以自己去看[官网](https://webpack.js.org/loaders/babel-loader/#usage)上它是怎么使用loader的。

```javascript
  ...
  // 使用loaders的列表
  module: {
    // 定义规则
    rules: [
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
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
  ...
```

- 配置文件写完了，然后我们就可以使用命令开始打包了：
```
$ npm run build
```

- 对比chapter2之前打包后生产的`dist/main.js`文件，我们确实可以看到各模块内容中的es6语法都转换为es5语法了。

不使用babel打包 | 使用babel打包后
---|---
![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter3_2.png)|![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter3_1.png) 


### 4、babel-polyfill
- 到了这里你以为就完了吧，想舒适的使用方便又快捷的es6语法哪里是这么简单的事情哦！上文安装的`babel-loader`可以转，但是不支持把所有的es6转换为es5，比如一些`promise`啊、`Array.from`这些语法啊，babel-loader就不能处理，所以babel就又提供了一个`babel-polyfill`包。

- `babel-polyfill`简单点理解就是补充了babel的转换能力，为当前的环境提供一个**垫片**（很高深的词汇，牛逼了），ok，那接下来就是谈如何使用的问题了。

- 如何使用[babel官网](https://babeljs.io/docs/en/babel-polyfill)都有写，我这里大概讲一下。首先npm安装这个包，要走`--save`。

```
$ npm install --save @babel/polyfill
```

- 第一种方式你可以在所需的js文件开头可以`import "@babel/polyfill"`引入这个文件。第二种方式也就是这个项目中我们会用到的方式，加个`useBuiltIns: "usage"`即可。
```
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
+               {
+                  // 添加babel-polyfill
+                  useBuiltIns: "usage"
+                }
              ]
            ]
          }
        }
      }
    ]
  }
};
```

- 然后输入`npm run build`打包，就ok了。[webpack中使用polyfill](https://babeljs.io/docs/en/babel-polyfill#usage-in-node-browserify-webpack)有几种方式，各种异同大家可以去官网了解下。
![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter3_3.png)

### 5、关于core-js
- 当你成功的完成了上面的配置步骤，能正常打包也能在浏览器中正常显示，那么我们配置的babel基本能满足你大部分的开发需求了，但是当我们打包的时候应该会碰到几个问题。
- 第一个就是每次我们打包的时候，虽然打包成功了，但是会看到有`warning`警告。
![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter3_4.png)

- 阅读并查阅babel官方文档以后发现原来在`Babel 7.4.0`以后，`@babel/polyfill`这个包就会被移除了。官方叫我们直接使用`core-js`来代替`@babel/polyfill`的作用。

- 所以我们需要改点东西。先在`package.json`的把`@babel/polyfill`移除（仓库代码里为了做演示我就没移除了），并安装`core-js`包。
```
$ npm install core-js@3 --save
```
```
  ...
  "dependencies": {
-   "@babel/polyfill": "^7.8.3"
+   "core-js": "^3.6.4"
  }
  ...
```

- 参考[文档](https://babeljs.io/docs/en/babel-preset-env#corejs)修改一下`webpack.config.js`配置文件，这个很简单，加一行代码就可以了。

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
               {
                  // 添加babel-polyfill
                  useBuiltIns: "usage",
+                 corejs: { version: 3, proposals: true }
                }
              ]
            ]
          }
        }
      }
    ]
  }
};
```


### 4、小结
- 这章我们了解了下`webpack`的`loaders`，然后使用babel实践了一下，到了这里大家应该对webpack是干什么的，`loader`是个啥有了一定了解了。
- 总而言之，用一个牛逼一点的概念来说就是**赋能**，有了这些`loader`来处理各种各样的文件，`webpack`变得强大了，在`webpack`里定义了相应`loader`以后，就能让`webpack`认识并处理它们了。
- `babel`不建议我们继续使用`@babel/polyfill`这个**垫片**了，推荐直接安装`core-js`包。
- `loaders`还没完，常用的还是的说说，下节讲下如何处理图片资源。
- 参考链接：
  - [babel官网](https://babeljs.io/setup#installation)
  - [webpack官网](https://webpack.js.org/loaders/babel-loader/#usage)


