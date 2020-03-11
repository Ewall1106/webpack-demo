## webpack从0到1-打包图片资源
> 上节讲了下webpack的loaders，然后尝试用babel-loader打包了下，想这些基础的loader还有一些需要介绍一下，本章说下关于打包图片资源的loader：`file-loader`和`url-loader`。  
> git仓库：[webpack-demo](https://github.com/Ewall1106/webpack-demo)


### 1、开始
- 老规矩，复制一份[上章](https://github.com/Ewall1106/webpack-demo/tree/master/chapter03)的目录改名为`chapter4`。
- 随着找张图片放到`src/assets`目录下，并同时新建一个`logo.js`文件。
```
 webpack-demo/chapter4
  ...
  |- /src
+   |- /assets
+     |- logo.png
+   |- logo.js
    |- content.js
    |- footer.js
    |- header.js
    |- index.js
  |- index.html
  |- package.json
  |- webpack.config.js
  ...  
```

- 然后我们在`src/logo.js`里面引入这张图片并挂载到页面上。
```javascript
+ import Logo from "./assets/logo.png";

+ export function createLogo() {
+   const myLogo = new Image();
+   myLogo.src = Logo;
+   document.body.appendChild(myLogo);
+ }
```

- 在`src/index.js`中：
```javascript
+ import { createLogo } from "./logo";
import { createHeader } from "./header";
import { createContent } from "./content";
import { createFooter } from "./footer";

+ createLogo();
createHeader();
createContent();
createFooter();
```

### 2、file-loader
- 很明显，你这`.png`后缀的引入文件webpack压根不认识你，所以我们需要安装相应的loader也就是`file-loader`来处理这种文件，给webpack**赋能**。
```
$ npm install file-loader --save-dev
```

- 使用，在`webpack.config.js`中配置它：
```javascript
// ...
 module: {
    rules: [
      // ...
      {
        // 使用file-loader处理文件
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      }
    ]
  }
// ...
```

- 然后我们使用打包命令就可以看到`dist`目录下打包生成了一张新的图片了，它是经过`file-loader`打包压缩的，名字是一个`hash`值，名字什么的都是可以修改了，后面再讲。打开`dist/index.html`也能正常显示。
```
$ npm run build
```

```
 webpack-demo/chapter4
  ...
  |- /dist
+   |- 82b9c7a5a3f405032b1db71a25f67021.png
    |- index.html
    |- main.js
  ...  
```


### 3、url-loader
- 其他一些需要补充说明的是，`file-loader`很强大，像`.xml`文件啊，`.csv`、字体文件`.ttf`等等它都能处理，可是对于处理图片来说，可能我们有更好的选择。
- 先安装`url-loader`：
```
$ npm install url-loader --save-dev
```

- 修改`webpack.config.js`文件。
```javascript
// ...
 module: {
    rules: [
      // ...
-     {
-       // 使用file-loader处理文件
-       test: /\.(png|svg|jpg|gif)$/,
-       use: ["file-loader"]
-     },
+     {
+       // 使用url-loader处理图片资源，当图片size小于limit值时会转为DataURL
+       test: /\.(png|jpg|gif)$/i,
+       use: [
+         {
+           loader: "url-loader",
+           options: {
+             limit: 8192
+           }
+         }
+       ]
+     }
    ]
  }
// ...
```

- `url-loader`跟`file-loader`的工作能力一样，也可以用来处理图片资源，但是它可以设置一个`limit`值，这样如果你的图片大小小于这个`limit`值，那么它就会直接把图片转为一个base64的`DataURL`，不会打包为一张新的图片了，所以如果你的图片小于你设置的`limit`值，那么打包后的`dist`目录下是没有如上文中那样有新的图片生成。
![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter4_1.png) 


### 4、小结
- 大概就是这么些东西，使用webpack并使用不同的loader来处理图片资源，还是比较简单的。
- 下节谈下处理css、less、sass文件。
- *参考链接:*  
[webpack官网](https://webpack.js.org/guides/getting-started/#basic-setup)    
[webpack从0到1系列文章](https://github.com/Ewall1106/webpack-demo)    
