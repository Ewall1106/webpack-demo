## webpack从0到1-less、sass、postcss
> 还是延续上节的内容，`webpack`如何处理less、sass这种预编译样式文件。  
> 本节的内容主要是`postcss`的运用，postcss很强大，我们小试牛刀用它来实现在不同的浏览器中为我们自动添加前缀如`-webkit-`、`-moz-`等等以做兼容。  
> git仓库：[webpack-demo](https://github.com/Ewall1106/webpack-demo)

### 1、处理sass
- 继续沿用上一章的代码放置新建文件夹`chapter6`下。
- 首先，我们需要安装处理`sass`文件相关的`loader`[->webpack之sass-loader](https://webpack.js.org/loaders/sass-loader/)。

```
$ cd chapter6
$ npm install sass-loader node-sass --save-dev
```

- 然后我们需要在`webpack.config.js`中配置它。
```javascript
...
  module: {
    rules: [
      // 处理sass
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader" // 将 Sass 编译成 CSS，默认使用 Node Sass
        ]
      },
    ]
  }
...
```

### 2、新建
- 进入到项目中在`src/styles`下新建`content.scss`文件，用来测试。
```
 webpack-demo/chapter6
  ...
  |- /src
    |- /assets
    |- /styles
       |- header.css
+      |- content.scss
    |- logo.js
    |- header.js
    |- content.js
    |- footer.js
    |- index.js
    |- header.css
  |- index.html
  |- package.json
  |- webpack.config.js
  ...  
```

- 在`content.js`中随便输入几行`sass语法：
```scss
body {
  .content {
    background: green;
  }
}
```

- 在`src/content.js`中给这个块级元素添加一个`.content`类名。
```javascript
export function createContent() {
   const div = document.createElement("div");
   div.innerText = "主体内容";
+  div.classList.add("content");
   document.body.appendChild(div);
}
```

- 在`src/index.js`模块中引入这个`content.scss`文件。

```javascript
import { createLogo } from "./logo";
import { createHeader } from "./header";
import { createContent } from "./content";
import { createFooter } from "./footer";

import "./styles/header.css";
+ import "./styles/content.scss";

createLogo();
createHeader();
createContent();
createFooter();
```

- 然后我们`npm run build`打包后再打开`dist/index.html`就可以看到内容块的新增的绿色背景样式了。这样就证明我们的sass处理打包就成功了。


### 3、处理less
- 过程与上同理，在`src/styles`目录下新建用来测试的相关`footer.less`文件并在`src/index.js`中引入它用来测试看效果，就不浪费篇幅了，具体可以看仓库代码。

- 安装并配置`less-loader`，然后打包刷新浏览器就可以看到效果了。
```
$ npm install less less-loader --save-dev
```
```javascript
...
  module: {
    rules: [
      ...
      // 处理less
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"]
      },
      ...
    ]
  }
...
```

### 4、安装postcss
- 现在我们有这么一个常见的需求场景，比如说当我们使用`css3`新特性的时候，我们需要根据不同的浏览器自动加上浏览器前缀如`-webkit-`、`-moz-`等等以做兼容。怎么处理？先动手用一下，后面再来小结，先安装`postcss`:
```
$ npm i postcss-loader --save-dev
```

- 然后我们还需要安装能给我们`css3`自动添加浏览器前缀的插件[autoprefixer](https://github.com/postcss/autoprefixer)。
```
$ npm install autoprefixer --save-dev
```
- 在`src/styles/content.scss`中写点`css3`语法用来测试。
```css
.header {
   background: green;
+  box-shadow: 0 0 20px green;
}
```

### 4、配置postcss
- 在`chapter6`目录下新建一个`postcss.config.js`文件并配置添加这个刚刚安装的`autoprefixer`插件。
```
 webpack-demo/chapter6
  ...
  |- /src
  |- index.html
  |- package.json
+ |- postcss.config.js
  |- webpack.config.js
  ...  
```
```
+  module.exports = {
+    plugins: {
+      "autoprefixer": {}
+    }
+  };
```

- 去`webpack.config.js`中配置这个`post-loader`。我这里以应用`scss`文件为例，其它样式文件也是一样的配置，详见源码。（这个loader放置的位置顺序要注意一下）
```javascript
...
  module: {
    rules: [
      // 处理sass
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
+         "postcss-loader", // 因为这里处理的是css文件，所以要放在sass-loader的上面
          "sass-loader"
        ]
      },
    ]
  }
...
```

- 到了这一步，基本配置就完成了，但是还有一个东西一定要记得设置，不然压根没效果。进入到`package.json`中，我们要设置**所支持的浏览器列表**，切记！！！（这一步很重要，我就是忘记设置这一步，导致一直没效果，找了很久的问题！！！）
```
{
...
+  "browserslist": [
+    "> 1%",
+    "last 2 versions"
+  ]
...
}
```

- 然后我们输入命令打包，在浏览器中打开`dist/index.html`就可以看到自动为我们添加好了前缀了。
![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter6_1.png) 

### 4、小结
- Ok，小结一下，对于`less`和`sass`的处理很简单，不过是上一节处理css文件的一个延伸罢了，不多说，主要说下`postcss`。
- 对于`postcss`这个怎么用的你应该亲自实践过了，并且有了一个基本的认识。
- 首先我想说，你可以把`postcss`也理解为一个？？生态吧，就像是`webpack`可以有很多的`loader`来给它**赋能**，`babel`也有许多插件来给它**赋能**。
- [postcss](https://github.com/postcss/postcss)也同样有许多来给它赋能（官网上就列举了许多），如上面我们用到的`autoprefixer`插件，另外还有我们一般用`postcss-px-to-viewport`插件来实现[使用vw实现移动端适配移动端适配](https://juejin.im/entry/5aa09c3351882555602077ca)等等，

*参考链接：*     
[postcss-loader](https://webpack.js.org/loaders/postcss-loader/)    
[webpack css-loader](https://webpack.js.org/loaders/css-loader/)    