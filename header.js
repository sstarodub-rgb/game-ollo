alert("1");

document.addEventListener("DOMContentLoaded", () => {
  alert("2");

  const header = document.createElement("div");

  header.style.position = "fixed";
  header.style.top = "0";
  header.style.left = "0";
  header.style.right = "0";
  header.style.height = "60px";
  header.style.background = "red";
  header.style.color = "white";
  header.style.zIndex = "999999";
  header.style.display = "flex";
  header.style.alignItems = "center";
  header.style.justifyContent = "center";

  header.textContent = "HEADER TEST";

  document.body.appendChild(header);

  alert("3");
});