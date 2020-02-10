import Logo from "./assets/logo.png";

export function createHeader() {
  const myLogo = new Image();
  myLogo.src = Logo;
  document.body.appendChild(myLogo);

  const div = document.createElement("div");
  div.innerText = "头部块";
  document.body.appendChild(div);
}
