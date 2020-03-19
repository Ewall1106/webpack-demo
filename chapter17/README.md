## webpack从0到1-构建vue项目
> 讲下webpack中的对于vue配置，其实vue官方就提供了一套模板[vue-webpack-template](https://github.com/vuejs-templates/webpack)，我们学习学习，然后基于当前自己的项目来配置下。    
> git仓库：[webpack-demo](https://github.com/Ewall1106/webpack-demo)


### 1、处理vue
- 对于`.vue`这种文件，`webpack`肯定是不认识的，所以我们需要相应的`loader`来处理它，通过查阅[文档](https://vue-loader.vuejs.org/zh/guide/#vue-cli)我们发现需要安装这两个东西：
```
$ npm install vue-loader vue-template-compiler --save-dev
```

- 然后安装文档上面的教程，照猫画虎搞一下。这个`loader`两个环境都是需要的，我们应该是丢到`webpack.common.js`中：
```javascript
// webpack.common.js
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  module: {
    rules: [
      // ... 其它规则
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    // 请确保引入这个插件！
    new VueLoaderPlugin()
  ]
}
```


### 2、写点vue
- 首先既然要使用`vue`，就需要安装它。
```
$ cd chapter17
$ npm install vue --save
```

- 然后我们需要对当前的文件目录做次比较大的改动：
```
  webpack-demo/chapter17
  |- /build
  |- src
-   |- assets
-   |- styles
-   |- content.js
-   |- footer.js
-   |- header.js
-   |- logo.js
+   |- App.vue
    |- index.js
  |- index.html
  |- package.json
  |- postcss.config.js
  |- README.md
```
- 然后我们在`App.vue`中写点内容(你应该很熟悉)：
```html
<template>
  <div id="app">
    hello world
  </div>
</template>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
```

- 然后我们删掉`src/index.js`这个入口文件原来所有的示例代码，使用下面这部分替换：
```javascript
import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
```

- 上面这个就是`vue`的语法罗，会将所有的内容都挂载到`id`为`app`的这个元素上，很明显我们目前没有，所以我们需要对`src/index.html`这个模板加上这个元素：
```html
<!DOCTYPE html>

<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><%= htmlWebpackPlugin.options.title %></title>
</head>

<body>
+    <div id="app"></div>
</body>

</html>
```

- 然后我们`npm run dev`打包，浏览器中就会显示出`hello world`了。现在，是不是有点vue的那意思了？

### 3、关于路由
- 页面要跳转，很明显，现在我们还少了[vue-router](https://router.vuejs.org/zh/installation.html)这个必要的东西，然我们参照官网的教程，安装一下：
```
$ npm install vue-router --save
```

- 然后，为了让我们现在这个项目跟像一个标准的`vue`项目，所以我们参照一下`vue-webpack-template`的目录结构对我们的做点修改。
    - 我们将原来的一直伴随我们的`header`、`footer`、`content`三块的js及样式文件都迁移到了`components`目录下作为了三个`子组件`。
    - 新建了一个`src/views`里面放了放了两个页面组件，用来测试`router`的跳转。

| 上一章的src目录 | 现在的src目录 |
| --- | --- |
|![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter17_1.png)|![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter17_2.png)


- 新建了一个路由文件，`src/router/index.js`就是vue脚手架初始化生成的内容了：
```javascript
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/home.vue")
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/about.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
```

- 然后需要在入口文件`src/index.js`中引入这个路由，还有一些其他的都是关于vue的基本使用用法的东西就不多说了，去看下[仓库源码](https://github.com/Ewall1106/webpack-demo/tree/master/chapter17)即可。


### 4、问题
- 到了这一步以后，自然我们需要跑一下项目，这时候问题来了，死活这张图片不显示；报`http://localhost:8080/[object%20Module]`找不到图片的错误。
![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter17_3.png)

- 经过一顿google后终于找到了答案，原来我们需要在`webpack.common.js`中使用`url-loader`的地方把`esModule`设置为`false`[-->错误reason](https://github.com/vuejs/vue-loader/issues/1612)。
```javascript
 // ...
 {
    test: /\.(png|jpg|gif)$/i,
    use: [
      {
        loader: "url-loader",
        options: {
          limit: 4096,
+         esModule: false
        }
      }
    ]
  }
```

- 学点东西还是挺不容易啊，坑真多。。。。终于，看到了完整的页面，路由跳转页也没问题。
![](https://raw.githubusercontent.com/Ewall1106/webpack-demo/master/docs/images/chapter17_4.png)

### 5、小结
- 嗯，回想过去第一次用`vue-cli`脚手架搭起页面的时刻，是不是有那味了？`react`也是差不多，装下react react-dom，但是由于我react的技术栈不是很熟，就不班门弄斧了，用`create-react-app`这个官方脚手架初始化搞个项目，原理也都一样。
- 至此，我们也从0到了1的配置了一个跟`vue-webpack-template`这样的模板项目出来了，虽然比不上官方，但也算是有模有样的。
- 参考链接：
    - [https://github.com/vuejs/vue-loader/issues/1612](https://github.com/vuejs/vue-loader/issues/1612)
    - [vue-cli](https://vue-loader.vuejs.org/zh/guide/#vue-cli)
    - [vue-router](https://router.vuejs.org/zh/installation.html)










