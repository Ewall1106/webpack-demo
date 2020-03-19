## webpack从0到1-Prefetching/Preloading
> 简单说下webpack中关于Prefetching/Preloading的设置。  
> git仓库：[webpack-demo](https://github.com/Ewall1106/webpack-demo)

### 1、是什么？
- 首先解决的第一个问题就是`prefetching`和`preloading`这两个是个啥子东西？
- `preloading`：设置这个指令，就会在当前的页面中，以较高优先级预加载某个资源。其实就相当于浏览器的预加载，但是浏览器的预加载只会加载html中声明的资源，但是`preloading`突破了这个限制，连css和js资源也可以预加载一波。
- `Prefetching`：设置这个指令，就表示允许浏览器在后台（空闲时）获取将来可能用得到的资源，并且将他们存储在浏览器的缓存中。
- 这两种其实都是webpack提供的资源加载优化的方式，反正如果就是设置了这几个指令，就会先走个`http`的缓存，然后下次再次请求的时候直接从缓存里面拿，这样就节省了加载的时间。
- 看到这里如果你懵逼了，我这里丢两个链接，你去看看，然后下面我们具体通过实践体会一下。
    - [webpack-Prefetching/Preloading modules](https://webpack.js.org/guides/code-splitting/#prefetchingpreloading-modules)
    - [什么是 Preload，Prefetch 和 Preconnect？](https://github.com/fi3ework/blog/issues/32)
### 2、开始
- 延续我们前面章节的代码，我们现在假设一个需求：对于`footer.js`底部栏来说，只有当页面body点击的时候才挂载上来。
- `import()`方法是`es6`的动态加载模块方法，[-->阮老师import讲解](https://es6.ruanyifeng.com/?search=import&x=0&y=0#docs/module#import)。

```javascript
  import { createLogo } from "./logo";
  import { createHeader } from "./header";
  import { createContent } from "./content";
- import { createFooter } from "./footer";

  createLogo();
  createHeader();
  createContent();
- createFooter()

// 动态加载footer模块
+ document.body.addEventListener("click", () => {
+   import("./footer.js").then(module => {
+     console.log(module);
+     module.createFooter();
+   });
+ });
```

- 只有当我们点击页面的时候才会引入，这样我们就实现了动态的`import`引入`footer`模块了，ok，打包看一下。
- 这个`0.bundle.js`就是`footer.js`经过`codeSpliting`代码分割以后所输出的文件，文件名什么的都能改，上章都有提及[-->webpack从0到1-CodeSplitting代码分割]()。

点击页面前 | 点击页面后
---|---
![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter12_1.png)|![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter12_1.png)


### 3、设置Prefetching
- 那接下来设置一下`Prefetching`，很简单:
```javascript
// 动态加载footer模块
document.body.addEventListener("click", () => {
+ import(/* webpackPrefetch: true */ "./footer.js").then(module => {
    console.log(module);
    module.createFooter();
  });
});
```

- 但我们再次刷新浏览器打开控制台你就会看到，我们没有点击页面的时候它就会帮我自动先加载一遍`0.bundle.js`，然后当我们点击页面动态加载的时候，就是直接走的缓存了。
![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter12_3.png)


### 4、设置Preloading
- 关于设置Preloading的就没有什么好说的了，其实也就是加一行代码，上面同样的位置设置为`/* webpackPreload: true */`就行了。
- 两者的异同官网都有解释，中文文档也有，我就直接贴图了：
![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter12_4.png)

- 最后我们小结一下。

### 5、小结
- 其实webpack官网对于这两个东西的解释我觉得就比较到位了，`Preloading`什么时候用呢？比如说，你页面中的很多组件都用到了`jQuery`，比较**强依赖**这个东西，那么我们就可以当import引入jQuery库的时候设置为`Preloading`，让他预加载一波。
- 而`Prefetching`我们一般用的比较多，也比较好理解，用官网的例子来说：一般当我们进入一个网站首页，只有当点击登录按钮的时候模态框才需要弹出来，那么我们就可以对这个`login模态框`组件做下`Prefetching`，当首页加载完毕，浏览器空闲的时候提前加载一下，这样当用户点击登录按钮就可以直接从缓存里面加载这个组件了。

*参考链接:*  
[webpack-Prefetching/Preloading modules](https://webpack.js.org/guides/code-splitting/#prefetchingpreloading-modules)  
[什么是 Preload，Prefetch 和 Preconnect？](https://github.com/fi3ework/blog/issues/32)


