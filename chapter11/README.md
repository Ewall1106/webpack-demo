## webpack从0到1-CodeSplitting代码分割
> 简单说下代码分割。  
> git仓库：[webpack-demo](https://github.com/Ewall1106/webpack-demo)

### 1、什么是codeSplitting？
- 前面[第7章](https://github.com/Ewall1106/webpack-demo/tree/master/chapter07)讲output多页面相关的内容时，我们将`content.js`、`header.js`、`footer.js`分别打包为三个文件，然后我们在`index.html`中用三个`script`标签引入它们，很明显，上述过程其实就是一种手动式的代码分割。
- 那这样写有什么好处？
    - 我们可以给`index.html`中引入的三个script标签加个`async`属性，这样的话当我们首次进入页面的时候，就可以异步加载了，比起不做代码分割，可以提高页面渲染速度。
    - 如果我们修改了其中的某一个文件，那么浏览器就只会重新加载那个文件了，其他两个文件会走缓存，这样，又可以进一步的提高加载性能。
- 所以啊，虽然例子有点生硬，但是`Code Splitting`大概就是这么个概念，好处也是这么个好处，大概就这么个意思吧，只是，手动式未免有点麻烦。


### 2、配置
- 而`webpack`可以帮我们轻松的实现[代码分割](https://webpack.js.org/guides/code-splitting/)，我们进入到`webpack.config.js`中，添加如下几行配置：
```javascript
module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },

+ // 代码分割codeSpliting
+ optimization: {
+   splitChunks: {
+     chunks: "all"
+   }
+ },
  // ...
};

```

- 这个配置是个什么意思？就是说对于公共引用的模块（库）帮我单独提出来做下代码分割。

- 于是乎，当我们`npm run build`打包后，在`dist`文件下就可以看到自动生成了一个`verdor~main.js`文件，打开它，我们就可以看到它帮我们把`src/index.js`中引入的`axios`拎出来了（也就是代码分割了）。
![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter11_1.png) 

- 你可能会问，在`src/index.js`中`import`引入的又不仅仅是`axios`，还有`header.js`、`content.js`、`footer.js`等等，怎么那些没有分割出来单独为一个文件？下文详解。

### 3、SplitChunksPlugin
- 上面`webpack`帮我们实现代码分割，利用的就是[SplitChunksPlugin](https://webpack.js.org/guides/code-splitting/#splitchunksplugin)这个插件，这个可配置的内容就很丰富了，只拿几个常见的选项来举例一下。

- 当我们什么都不做，仅仅只是配置`splitChunks: {}`,其实就是默认相当于：
```javascript
module.exports = {
  // ...
  optimization: {
    splitChunks: {}
  }
  // 等同于：
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minRemainingSize: 0,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
      automaticNameDelimiter: '~',
      automaticNameMaxLength: 30,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  // ...
};
```

- 这其中通过去看文档可以得到更好的理解，我这里也写不了这么多，只举几个：
    - `chunks`：这里默认值为`async`，只有在异步引入模块的时候才会做分割，所以前面例子中我们将其设置为`all`，这样同步异步的引入都会自动的做代码分割了。
    - `minSize`：就是说引入的文件多大才会做分割，在`src/index.js`中`import`引入的`header.js`、`content.js`等不满足这个条件，所以就没有分割了。
    - `minChunks`：我们以引入`axios`为例啊，这个就是说最小的引入次数，默认为1，如果你一次都没有，肯定就不会做代码分割了。
    - `cacheGroups`：
        - 当你上面所有的条件（minSize、chunks、minChunks等等）都满足了以后，首先就会进入的这个`defaultVendors`里面，里面会test校检，像我们的`axios`引入就是来自`node_modules`包里的，所以就满足就会做分割，打包后为`dist/vendors~main.bundle.js`文件，不满足就走下面的`default`，我们打包后的文件名也可以通过配置一个`filename`来改变名字。
        - 那为什么叫`缓存组`呢？再举一个例子，比如我们在`src/index.js`中`import`引入的`header.js`、`content.js`、`foooter.js`这三个文件，当对`header.js`做代码分割的时候，走进`cacheGroups`中满足default选项，这时候会打包进去并缓存起来，当`content.js`进来发现也满足这个条件，所以也会把它丢进去，以此类推，最后打包完成了作为一个文件输出到dist文件中。
    - 等等。。。



### 4、小结
- 这部分内容一篇文章说不可能说清的，只能讲点大概的意思，我相信你你已经理解明白了。
- 其实配置起来这个代码分割还是比较简单的，也就一两行代码就行了，只是里面的所提供可配置项还是比较多的，这时候就只能去查文档了。

*参考链接*
[webpack-代码分割](https://webpack.js.org/guides/code-splitting/)  
[SplitChunksPlugin](https://webpack.js.org/guides/code-splitting/#splitchunksplugin)  
