## webpack从0到1-entry、output、sourcemap
> 简单说下entry、output，然后了解下sourcemap，这个东西还是比较重要。  
> git仓库：[webpack-demo](https://github.com/Ewall1106/webpack-demo)

### 1、entry与output
- 对于`入口entry`我们常见的其实是简写模式，我们可以使用键值对的形式来定义它，其实默认是这样的。
```javascript
module.exports = {
  ...
  // 简写
  entry: "./src/index.js",
  
  // 默认
  entry: {
    "main": "./src/index.js",
  }
  ...
}
```

- 而`输出output`中`filename`就是打包后指定的文件名，`path`就是存放的位置。还有一些其他的输出名称更改的几个点：
    - `[name]`就是entry里面的key键名
    - `[hash]`就是一段hash值，这个还是挺常见的。
```javascript
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    "app": "./src/index.js",
  },
  output: {
-   filename: 'bundle.js',
+   filename: '[name].bundle.[hash].js',
    path: path.resolve(__dirname, "dist")
  }
}
```

- 最后我们打包就会生成一个长成这样的文件：`app.bundle.ee39eb0347a038bf0d2f.js`


### 2、多页面相关
- 一般来说，我们在写多页面应用的时候，可能有指定的多个入口文件，这个时候就需要分开打包了，而不是把所有的文件打包为一个。比如说在我们项目中要把`header.js`、`content.js`、`footer.js`的打包为三个文件。
```javascript
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    "header": "./src/header.js",
    "content": "./src/content.js",
    "footer": "./src/footer.js",
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, "dist")
  }
}
```

- 打包完以后，我们就会生成三个文件，如果把这三个文件作为三个不同的入口文件，分别引入各个index.html中，这就是写多页面的基础思路吧。
![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter7_1.png) 

### 3、关于sourceMap
- 回到开始的状态，在我们的开发过程中啊，当我们打包的时候，我们会把几个模块的文件打包为一个`main.js`输出出去，这个时候，如果某个js文件出了错，那么在浏览器中指出的这个错误位置是跟`main.js`相关联的，这对我们找出错误毫无意义。
- 比如，我们在`src/header.js`中打印一行错误。然后要去`webpack.config.js`中把`mode: "development"`这行代码注释掉，因为开发模式下，默认是开启了`sourcemap`的。
```javascript
export function createHeader() {
+ console.error('这是一行错误')
  const div = document.createElement("div");
  div.innerText = "头部块";
  div.classList.add("header");
  document.body.appendChild(div);
}
```
- 打包后浏览器中打开，打印出的信息对于我们找出错误并没有什么卵用。
![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter7_2.png) 

### 4、使用sourceMap
- 而`sourceMap`就是解决这个问题的，当浏览器抛出错误的时候可以帮我们定位到具体的js文件和行列位置。
- 在`webpack`中开启`sourceMap`是个很简单的事情：
```javascript
  module.exports = {
    mode: 'development',
    // 开启sourceMap
+   devtool: 'inline-source-map',
    entry: {
      main: "./src/index.js"
    },
    output: {
      publicPath:'/',
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist")
    }
    ...
  };
```

- ok，那`devtool: 'inline-source-map'`中`inline-source-map`是个啥意思，我这里简单扯两句。
    - 首先呢，你可以设置这个键值为`source-map`，这样打包就会生成一个`.map`的映射文件。
    - 而`inline-source-map`就是会把这个`.map`文件直接作为DataUrl插入到`main.bundle.js`中。
    - 还有很多键值可以配置，总之就是会对打包效率什么的有一些影响，具体看这里:[devtool](https://webpack.js.org/configuration/devtool/)
    ![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter7_3.png) 


- 当我们在`webpack.config.js`中设置完`sourcemap`以后，打包刷新浏览器我们就可以看到打印信息变为这样，就可以很明确的帮我们定位到问题。
![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter7_4.png) 


### 5、小结

- `sorcemap`做了些什么事情呢？打包后会生成一个`.map`的映射文件，它会将你打包后的代码映射到源代码中，与之相关关联。这样，我们就知道在源代码中出错的位置是几行几列了。
- 配置`sorcemap`有很多的可选值，但是不用管这么多，开发模式中我们设置为`inline-source-map`或者`source-map`，生产模式中我们将其设置为`cheap-module-source-map`即可，react和vue都是这么设置的。作为一名新手，模仿是最有效的学习方式了。
- `entry`算是比较简单，但是`output`今天文章中提及的只是冰山一角，后面根据需求再设置，下面参考链接也可以去详细了解下它的一些配置项。

*参考链接：*
[webpack-output](https://webpack.js.org/configuration/output/)  
[webpack-entry](https://webpack.js.org/configuration/entry-context/)  
[webpack-devtool](https://webpack.js.org/configuration/devtool/)  






