## webpack从0到1-区分打包development和production
> 关于对开发环境和生产环境做不同的webpack配置。    
> git仓库：[webpack-demo](https://github.com/Ewall1106/webpack-demo)


### 1、缘起
- 这章我们要做下环境打包的一个区分啊，通过上面很多章的了解学习以后，我们知道，`webpack.config.js`仅仅这一个配置文件已经不能满足我们的需求了，因为开发环境和生产环境配置的内容是不一样的，有这么些异同：
    - `mode`模式，生产环境需配置为`production`，开发则设置为`development`;
    - `devtool`的`souremap`；
    - `devServer`，开发环境需要配置跨域代理转发，而生产环境不需要；
    - 代码分割，开发环境下不需要这个；
    - `HRM`，生产环境不需要这个，只要开发环境需要，而且这个容易与代码分割产生冲突，如果你生产环境及设置了代码分割又设置了HRM就会失效。
    - 等等。。。
- 为了解决这些不相容问题，所以我们需要多个不同环境下的`webpack`配置文件。

### 2、配置
- 首先我们在`chapter15`目录下新建一个`build`的文件夹，里面新增几个针对不同环境的配置文件。
```
  webpack-demo/chapter15
+ |- /build
+   |- webpack.common.js
+   |- webpack.dev.js
+   |- webpack.prod.js
  |- src
  |- index.html
  |- package.json
- |- webpack.config.js
  ...
```

- 接下来要做的就是要拆分原来的`webpack.config.js`文件了。
    - `webpack.common.js`就是一些生产和开发环境中都要用的配置。
    - `webpack.dev.js`就是只需在开发时生效的配置。
    - `webpack.prod.js`同理。
- 这些配置我就不浪费篇幅贴代码了，去仓库看一下或者自己抽一下吧，就是开头那些东西。[-->仓库代码](https://github.com/Ewall1106/webpack-demo/tree/master/chapter15)

### 3、合并
- 把旧的配置文件拆分完了，`common`部分我们还是需要合并的，首先我们要安装一个`webpack-merge`插件，这个插件可以帮我们做这个事情。
```
$ npm install webpack-merge --save-dev
```

- 然后我们合并配置文件，比如我们在`webpack.dev.js`中要把`common`合并进来：
```javascript
const merge = require("webpack-merge");
const commonConfig = require("./webpack.common.js");

const devConfig = { 
// development环境下的一些webpack配置
}

module.exports = merge(commonConfig, devConfig);
```

- 合并`webpack.prod.js`也是这样操作的，就不多说了，然后我们需要去`package.json`中修改下`scripts`脚本。
```json
{
  "name": "webpack-easy-demo",
  "version": "1.0.0",
  "description": "webpack从0到1",
  "main": "index.js",
  "scripts": {
    "watch": "webpack --watch",
-   "build": "webpack",
-   "start": "webpack-dev-server",
+   "dev": "webpack-dev-server --config ./build/webpack.dev.js",
+   "build": "webpack --config ./build/webpack.prod.js"
  },
  // ...
}
```

- 然后我们使用两个命令打包就ok了。
```
$ npm run dev
$ npm run build
```

### 4、小结
- 本章就是对于不同的webpack环境做不同的配置，可以更好的解耦，方便我们掌控webpack。
