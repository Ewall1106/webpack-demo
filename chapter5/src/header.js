export function createHeader() {
  const div = document.createElement("div");
  div.innerText = "头部块";
  div.classList.add("header");
  document.body.appendChild(div);
}
