export function createFooter() {
  const div = document.createElement("div");
  div.innerText = "尾部块";
  div.classList.add("footer");
  document.body.appendChild(div);
}
