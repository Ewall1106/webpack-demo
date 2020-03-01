import { createLogo } from "./logo";
import { createHeader } from "./header";
import { createContent } from "./content";

import axios from "axios";

import "./styles/header.css";
import "./styles/content.scss";
import "./styles/footer.less";

createLogo();
createHeader();
createContent();

// 动态加载footer模块
// import()：https://es6.ruanyifeng.com/?search=import&x=0&y=0#docs/module#import
document.body.addEventListener("click", () => {
  import(/* webpackPrefetch: true */ "./footer.js").then(module => {
    console.log(module);
    module.createFooter();
  });
});

// 测试devServer.proxy实现数据的代理转发
axios.get("/v2/movie/top250?start=25&count=25").then(function(response) {
  console.log("请求数据：", response.data);
});
