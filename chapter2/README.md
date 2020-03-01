> 本章在上章内容的基础上简单扩展一下，先说下模块的规范，有哪些标准，然后谈下webpack的loader怎么用以及使用webpack中的babel-loader简单打包一下。  
> git仓库：[webpack-demo](https://github.com/Ewall1106/webpack-demo)


### 1、模块化规范
- 上章我们知道`webpack`是一个模块打包工具，何为模块？一个js文件、css等等都可以称之为模块，ok，假设现在我有`a.js`、`b.js`、`c.js`等等，而且它们之间还要相互引用，咋整？这时候就需要有一套标准来定义该怎么引用啊，它们之间是个啥依赖关系啊之类的，那么大概就有这么几种模块化规范：
    - `ES6Module`--就是import、export这类的，我们对这个应该很熟。
    - `CommonJs`--就是require这种，node里面使用的，是node的模块规范。
    - `AMD`--是Require.js在推广的过程中对模块定义的规范化产出；
    - `CMD`--是淘宝Sea.js在推广的过程中对模块定义的规范化产出；
- **前面两种要好好了解，后面两种不用管了**，反正也快要被淘汰了，了解下就行。还有css的`@import`声明也是一种模块引入规范，大概就这么些。

### 2、新建模块
- 新建几个模块其实就是新建几个js文件，我们复制一份上节[chapter1](https://github.com/Ewall1106/webpack-demo/tree/master/chapter1)的内容，改名为`chapter2`。

- 我们在`src`目录下新建几个js文件，并在其中用`es6`的语法写一些内容并导出。
```
  webpack-demo/chapter2
  |- package.json
  |- index.html
  |- /src
    |- index.js
+   |- header.js
+   |- content.js
+   |- footer.js
  ...
```

- `header.js`内容：
```javascript
export function createHeader() {
  const div = document.createElement("div");
  div.innerText = "头部块";

  document.body.appendChild(div);
}
```

- `content.js`内容：
```javascript
export function createContent() {
  const div = document.createElement("div");
  div.innerText = "主体内容";

  document.body.appendChild(div);
}
```

- `footer.js`内容：
```javascript
export function createFooter() {
  const div = document.createElement("div");
  div.innerText = "尾部块";

  document.body.appendChild(div);
}
```

- 然后我们在`index.js`中引入这些模块，这样我们分模块的创建并引入了一些将要在页面上显示的内容了。
```javascript
import { createHeader } from "./header";
import { createContent } from "./content";
import { createFooter } from "./footer";

createHeader();
createContent();
createFooter();
```

### 3、打包模块
- 接下来我们就是要用webpack打包罗，因为`package.json`和配置文件`webpack.config.js`都是直接copy的上章[chapter1](https://github.com/Ewall1106/webpack-demo/tree/master/chapter1)的内容，所以我们直接输入命令打包。
```
$ npm run build
```

- 然后我们就可以看到打包后生成了的`dist`文件夹和该文件夹下的`main.js`，同上章一样复制一份`sr/index.html`文件到`dist`文件夹下文件内容改为：
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

- 然后我们在浏览器中打开，就可以看到页面上显示的`头部块、主体内容、尾部块`内容了。


### 4、小结

- 首先有个疑问，我们什么也没有安装，连熟悉的`babel`也没有安装，为什么能把`es6`的这种语法成功打包？
    - 很简单，因为`webpack`认识它。不仅`webpack`认识它，而且还在打包的时候对`import`和`export`做了转译，这点我们从打包后的main.js源码中就能看出来。
    - 所以我们能在chrome浏览器中正常的打开它并显示，再者，新版的chorme浏览器对es6语法也做了兼容。
- 虽然webpack会认识`import`和`export`，但是对其它的es6语法就不怎么认识了，再者像`chrome`这种优秀的浏览器虽然与时俱进的兼容了`es6`的语法，但是并不是所有的浏览器都像它这么优秀，所以我们还需要将其转为`es5`这种大众都认识的js语法，所以`babel`就上场了。
- ok，下章讲下webpack的`loaders`这个概念，然后使用常用的`bable-loader`将本章内容中的es6语法转换为es5。新知识每天不要学多了，搞个十五分钟差不多了。

### 5、其他
*参考链接*
- [webpack官网](https://webpack.js.org/guides/getting-started/#basic-setup)
- [webpack从0到1系列文章](https://github.com/Ewall1106/webpack-demo)
- [webpack官网关于module的解释](https://webpack.js.org/concepts/modules/#what-is-a-webpack-module)
