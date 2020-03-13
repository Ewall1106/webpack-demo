## webpack从0到1-devServer之数据请求
> 本章主要就是一个东西，如何配置webpack的devServer.proxy实现代理转发。这个应该是日常开发事情中必见的内容了。  
> git仓库：[webpack-demo](https://github.com/Ewall1106/webpack-demo)

### 1、开始
- 既然是请求数据，那么就先安装下[axios](https://github.com/axios/axios)。
```
$ cd chapter10
$ npm install axios --save
```

-  然后我们在`src/index.js`文件中使用`axios`请求一下[豆瓣api](https://douban-api-docs.zce.me/)的接口，拿它电影的前250条数据。
```javascript
+ import axios from "axios";

// ...

// 测试devServer.proxy实现数据的代理转发
+ axios
+  .get("http://douban.uieee.com/v2/movie/top250?start=25&count=25")
+  .then(function(response) {
+    console.log("请求数据：", response.data);
+  });
```

- 然后`npm run start`启动服务，然后我们在浏览器中就可以看到数据被请求成功了。
![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter10_1.png) 

### 2、相关问题
- 为什么我们可以一步就请求拿到了数据，好像没轮到`devServer.porxy`什么事情。那是因为豆瓣api没有对请求接口客户端来源没有做任何的限制，允许你跨域请求啊等等，但在真实的开发场景中是不切实际的。

- 在我们的开发中，请求的协议和域名是会变的，协议有`http`、`https`的变换，域名有测试域名、线上域名等等在不同的开发阶段被调用，你不能手动的替换每个请求的接口域名。
![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter10_2.png) 

- 所以一般我们是把上图中红框这一块移除，那么我们肯定就请求不到数据了。
```javascript
// ...
+ axios

-  .get("http://douban.uieee.com/v2/movie/top250?start=25&count=25")
+  .get("/v2/movie/top250?start=25&count=25")

+  .then(function(response) {
+    console.log("请求数据：", response.data);
+  });
```

### 3、proxy代理
- 为了解决上述问题，我们需要配置[devServer.proxy](https://webpack.js.org/configuration/dev-server/#devserverproxy)，进入到我们的`webpack.config.js`中。
```javascript
var path = require('path');

module.exports = {
  // ...
  devServer: {
   contentBase: path.join(__dirname, 'dist'),
   port: 8080,
   open: true,
+  proxy: {
+    "/v2": {
+       target: "http://douban.uieee.com",
+       pathRewrite: { "^/v2": "/v2" },
+       secure: false,
+       changeOrigin: true,
+     }
+   }
  }
  // ...
};
```
- `target`：把带有`/v2`的接口代理到请求`target`设置的这个服务器，就相对于请求`http://douban.uieee.com/v2/movie/top250?start=25&count=25`
- `pathRewrite`：可以把请求接口中的某部分重写，
    - 上面这个只是为了演示这个属性，`^/v2`是个正则，把所有`/v2`开头的都重写`/v2`，我们axios接口里本来就是以这个开头的，所相当于啥事没干，单纯演示。
    - 你可以改`pathRewrite: { "/movie": "/music" }`，把请求电影的的改为请求音乐的；还有一种比较在axios封装中比较常见的就是`pathRewrite: { "^/api": "/" }`，把所有以`/api`开头的就这串字符都删掉。不扯了不扯了。
- `secure`：允许`https`协议。
- `changeOrigin`：设置为ture表示允许跨域。


### 4、小结
- 讲的有点啰嗦，因为这部分内容比较常见，很多朋友这里也经常困惑，其实官网里这部分讲的很详细了，大家可以去看看。
- 基本内容就这么点，我这里只是抛砖引玉一下。

*参考链接：*  
[devServer.proxy](https://webpack.js.org/configuration/dev-server/#devserverproxy)