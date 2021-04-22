const darkMode = document.getElementById("darkMode");
const all = Array.from(
  document.getElementsByTagName("*") as HTMLCollectionOf<HTMLElement>
);

darkMode.addEventListener("click", () => {
  if (darkMode.innerHTML === "light") {
    all.forEach((element) => {
      element.style.color = "white";
      element.style.backgroundColor = "black";
    });
    darkMode.innerHTML = "dark";
  } else {
    all.forEach((element) => {
      element.style.color = "black";
      element.style.backgroundColor = "white";
    });
    darkMode.innerHTML = "light";
  }
});
