alert("СТРАНИЦА КОНЮХА РАБОТАЕТ");

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("test-btn");

  btn.addEventListener("click", () => {
    alert("Конюх: система работает нормально");
  });
});