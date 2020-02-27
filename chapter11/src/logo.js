import Logo from "./assets/logo.png";

export function createLogo() {
  const myLogo = new Image();
  myLogo.src = Logo;
  document.body.appendChild(myLogo);
}
