## 9、webpack从0到1-devServer初探
> 讲下解决每次修改文件后需要`npm run build`重复运行命令打包的问题。  
> git仓库：[webpack-demo](https://github.com/Ewall1106/webpack-demo)

### 1、问题
- 每次修改完文件内容要编译代码时，需要重复手动运行`npm run build`就是件很麻烦的事情。
- `webpack`中有几个不同的选项，可以帮助你在代码发生变化后自动编译代码，我这里主要说下第一、二种，相关内容[webpack教程里都有](https://webpack.js.org/guides/development/#choosing-a-development-tool)。
    - webpack's Watch Mode
    - webpack-dev-server
    - webpack-dev-middleware


### 2、Watch模式
- [watch模式](https://webpack.js.org/guides/development/#using-watch-mode)其实很简单，就是在`package.json`添加一行命令就行了，就能启动webpack的watch模式。
```
{
  "name": "webpack-easy-demo",
  "version": "1.0.0",
  "description": "webpack从0到1",
  "main": "index.js",
  "scripts": {
    "build": "webpack",
+   "watch": "webpack --watch",
    "start": "webpack-dev-server"
  },
  ...
}
```

- 然后我们使用`npm run watch`命令就可以实现打包，然后当我们修改文件内容，它也会帮我们自动再次打包实时监听。
- 但是有一个缺点就是，他不会帮我们把浏览器自动刷新，所以我们一般使用`webpack-dev-server`这个插件来实现更加丰富的功能。

### 3、安装配置
- 首先我们进入[chapter9](https://github.com/Ewall1106/webpack-demo/tree/master/chapter09)，安装这个插件：
```
$ cd chapter9
$ npm install webpack-dev-server --save-dev
```

- 接下来我们需要配置它，进入`webpack.config.js`中，这个插件可以帮助我们在本地起一个服务器，`devServer`有一系列的参数可以用来配置这个插件。
    - `devServer.contentBase`指定提供给服务器的内容放在哪里。
    - `devServer.port`指定本地服务器的端口号。
    - `devServer.open`当我们启动服务的时候会自动帮我们打开默认的浏览器。
    - 还有很多配置项提供参考。。。[-->devServer](https://webpack.js.org/configuration/dev-server/)
```javascript
var path = require('path');

module.exports = {
  //...
+  devServer: {
+   contentBase: path.join(__dirname, 'dist'),
+   port: 8080,
+   open: true
  }
};
```

- 然后我们在`package.json`中设置一条新的命令。
```
{
  ...
  "scripts": {
    "build": "webpack",
+   "start": "webpack-dev-server"
  }
  ...
}
```

- 配置完了，我们输入命令`npm run start`，这个打包过程的差异优越性体现在：
    - 首先，我们之前打包后的预览效果，就是直接打开`dist/index.html`，浏览器的地址为`file:///Users/ewall/Desktop/webpack-demo/chapter9/dist/index.html`；
    - 现在我们使用它会帮我们自动打开浏览器且地址为`http://localhost:8080/`，它为我们起了一个新的服务器。
    - 输入命令`npm run start`命令打包启动服务后，终端不会结束这个进程，会一直监听，当我们修改文件内容，就自动重新打包然后帮我们刷新浏览器。
    - 当我们把`dist`目录删除后再执行这个命令，虽然浏览器中自动打开也能正常显示，但是不会有新的`dist`文件夹生成了，因为这个插件不会显式的重复输出生成`dist`文件了，而是为了提高效率放到了内存里。

### 3、webpack-dev-middleware
- `webpack-dev-middleware`就是是一个中间件，用处就是可以把webpack打包后的文件传递给一个我们自建的服务器。
- 比如在这个项目里用`express`框架搭个服务后啊之类的，我们就可以结合这个中间件做些事情。
- `webpack-dev-server`里面也使用了这个插件，就不展开了，详见官网。

### 4、小结
- 这节总的来说目的就是说了下如何来监听文件，让过程自动化，提高我们的开发效率。
- 初步了解了下`devServer`这个强大的东西，下节我们进一步的了解它。

*参考链接：*  
[webpack-watch模式](https://webpack.js.org/guides/development/#using-watch-mode)