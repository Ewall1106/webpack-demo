export function createContent() {
  const div = document.createElement("div");
  div.innerText = "主体内容";
  div.classList.add("content");
  document.body.appendChild(div);
}
