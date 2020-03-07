export function createHeader() {
  console.error('这是一行错误')
  const div = document.createElement("div");
  div.innerText = "头部块";
  div.classList.add("header");
  document.body.appendChild(div);
}
