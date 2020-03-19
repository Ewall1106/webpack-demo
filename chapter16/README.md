## webpack从0到1-tree shaking
> tree shaking，这个还是一个比较重要的一个东西吧，可以大大的优化你的项目。  
> git仓库：[webpack-demo](https://github.com/Ewall1106/webpack-demo)

### 1、是什么？
- 我们首先从字面意思上来理解一下，`tree shaking`翻译一下就是摇树罗，摇树的时候就会把不必要的枯枝烂叶给摇下来，同理，到代码中，`tree shaking`就是把没有用到的代码shaking掉。

- `tree-shaking`只有使用es6的模块化规范才有效，如果你使用`commonJs`模块化规范是搞不了`tree-shaking`的，为什么？
> 因为`ES6`模块是运行时加载（静态加载），即可以在编译时就完成模块加载，使得编译时就能确定模块的依赖关系，可以进行可靠的静态分析，这就是`tree shaking`的基础。  
> 而`CommonsJs`必须在跑起来运行的时候才能确定依赖关系，所以与不能`tree-shaking`。  
> -- 参考阮大神的讲解[-->Module 的语法
概述](https://es6.ruanyifeng.com/#docs/module)



### 2、配置开发环境
- 如果你看要`tree-shaking`的一个具体的效果，那么你需要在`mode:development`中，因为在生产环境的时候，`webpack`会自动帮我们做`tree-shaking`。

- 示例代码可以直接看[官网](https://webpack.js.org/guides/tree-shaking/#conclusion)的，大概就这么几个配置：
- 设置usedExports为true
```javascript
mode: 'development',
optimization: {
  usedExports: true,
},
```
- `package.json`中设置下`sideEffects`，也可以是一个数组如`"sideEffects": ["*.css"]`就表示所有引入的`css`文件不做`tree-shaking`。

```javascript
{
  "name": "webpack-easy-demo",
+ "sideEffects": false,
}
```

- 这里配置好了就ok了，但是有个最大的问题是什么，看官网是这么说的：
> Ensure no compilers transform your ES2015 module syntax into CommonJS modules (this is the default behavior of the popular Babel preset @babel/preset-env - see the documentation for more details).   
> 要确保没有编译器把es6的语法转换为require这种commonJs的这种写法，但是babel的这个@babel/preset-env配置的默认行为就是如此。

- 我们配置使用[bable配置es6]()的时候就要使用了这个，如此一来，岂不凉了？为了不让`babel`将`es6`的`import/expot`转为`commonJs`规范的`require`写法，我们需要这样：
```javascript
{
   loader: "babel-loader",
   options: {
     presets: [
        [
          "@babel/preset-env",
          {
            useBuiltIns: "usage",
            corejs: { version: 3, proposals: true },
+           // 禁止将import/export转为require写法
+           modules: false
          }
        ]
      ]
   }
}
```


### 3、配置生产环境
- 配置生产环境就很简单了。
    - 将`mode`设置为`production`；
    - 设置下`sideEffects`;
    - 设置下`bable`配置`modules: false`。


### 4、小结
- 根据官网的conclusion总结，开启`tree-shaking`有四点：
    1. 必须使用es6的模块化规范（`import/export`）;
    2. 要确保你的编译器不会将es6的`import/expot`转为commonJs规范的`require`写法；（所以我们需要将`@babel/preset-env`的`modules`参数设置为`false`）
    3. 在`package.json`中添加`sideEffects`告诉webpack哪些是不用`tree-shaking`的文件。
    4. 模式mode要为`production`，因为`production`会自动使用`terser-webpack-plugin`这个插件来做一些压缩、无用代码的剔除实现`tree-shaking`。

- 这块内容有点东西啊，也不知道我理解的对不对，看看别人的文章吧：
    - [https://juejin.im/post/5a4dc842518825698e7279a9](https://juejin.im/post/5a4dc842518825698e7279a9)
    - [https://es6.ruanyifeng.com/#docs/module](https://es6.ruanyifeng.com/#docs/module)
    - [https://juejin.im/post/5d706172f265da03ca118d28](https://juejin.im/post/5d706172f265da03ca118d28)
    - [https://juejin.im/post/5dcec27d5188254b0147e619](https://juejin.im/post/5dcec27d5188254b0147e619)
    - [https://webpack.js.org/guides/tree-shaking/#conclusion](https://webpack.js.org/guides/tree-shaking/#conclusion)








