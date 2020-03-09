## webpack从0到1-处理css文件
> 讲下webpack如何处理css样式文件。   
> git仓库：[webpack-demo](https://github.com/Ewall1106/webpack-demo)

### 1、新建
- 进入项目中，在`src`目录下新建一个`styles/header.css`文件。
```
 webpack-demo/chapter5
  ...
  |- /src
    |- /assets
    |- content.js
    |- footer.js
    |- header.js
    |- index.js
    |- logo.js
+   |- header.css
  |- index.html
  |- package.json
  |- webpack.config.js
  ...  
```

- 里面手写一行简单的样式。
```css
/* header.css */
.header {
  background: red;
}
```

- 在`src/header.js`中给这个块级元素添加一个`.header`类名。
```javascript
// header.js
export function createHeader() {
  const div = document.createElement("div");
  div.innerText = "头部块";
+ div.classList.add("header");
  document.body.appendChild(div);
}
```

- 在`src/index.js`模块中引入这个`header.css`文件，这样头部块就会应用这行样式，使其背景变为红色。

```javascript
// index.js
import { createLogo } from "./logo";
import { createHeader } from "./header";
import { createContent } from "./content";
import { createFooter } from "./footer";

+ import "./styles/header.css";

createLogo();
createHeader();
createContent();
createFooter();
```


### 2、处理css
- 接下来我们就需要安装相应的loader了来处理`css`文件了。
```
$ npm install style-loader css-loader --save-dev 
```

- 安装完成了以后我们需要在`webpack.config.js`中配置它。
```
...
  module: {
    rules: [
      // 处理css等样式文件
+     {
+       test: /\.css$/,
+       use: ["style-loader", "css-loader"]
+     }
    ]
  }
...
```

- 然后我们执行命令打包，打包成功后打开`dist/index.html`文件就可以看到浏览器中正常显示头部块为红色的背景色。
```
$ npm run build
```

### 3、运行机制
- 打包没问题、浏览器中预览也没问题，这时候我们就要想，`style-loader`和`css-loader`做了什么事情？
- 首先第一点我们需要知道的是，在上面`use: ["style-loader", "css-loader"]`这行代码中，在webpack中是先执行`css-loader`再执行`style-loader`的，也就是我们常说的，webpack中执行的顺序是**从下到上，从右到左**。
- 当遇到`.css`文件的时候，先走`css-loader`，这个loader使你能够使用类似`@import`和`url(...)`的方法实现`require/import`的功能。
- 再走`style-loader`，它可以将编译完成的css挂载到html中。如图：
![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter5_1.png) 

### 4、小结
- `webpack`中`loader`加载顺序是**从下到上，从右到左**。
- `css-loader`使你能够使用类似@import和url(...)的方法实现require/import的功能；`style-loader`可以将编译完成的css挂载到html中。
- 这两个loader还有许多的配置项可以学习参考，大家可以去下面给的链接去了解。

*参考链接*
[webpack css-loader](https://webpack.js.org/loaders/css-loader/)  
[webpack style-loader](https://webpack.js.org/loaders/style-loader/)
