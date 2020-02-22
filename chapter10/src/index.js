import { createLogo } from "./logo";
import { createHeader } from "./header";
import { createContent } from "./content";
import { createFooter } from "./footer";

import axios from "axios";

import "./styles/header.css";
import "./styles/content.scss";
import "./styles/footer.less";

createLogo();
createHeader();
createContent(); 
createFooter();

// 测试devServer.proxy实现数据的代理转发
axios
  .get("/v2/movie/top250?start=25&count=25")
  .then(function(response) {
    console.log("请求数据：", response.data);
  });
