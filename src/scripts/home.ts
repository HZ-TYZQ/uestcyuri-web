const toggle = document.querySelector<HTMLButtonElement>(".menu-toggle")!;
const nav = document.querySelector<HTMLElement>("#primary-nav")!;

function setMenu(open: boolean) {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.querySelector("span")!.textContent = open ? "−" : "＋";
  nav.classList.toggle("is-open", open);
}

toggle.addEventListener("click", () =>
  setMenu(toggle.getAttribute("aria-expanded") !== "true"),
);
nav
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    toggle.getAttribute("aria-expanded") === "true"
  ) {
    setMenu(false);
    toggle.focus();
  }
});
window
  .matchMedia("(max-width:600px)")
  .addEventListener("change", () => setMenu(false));

const filters = document.querySelectorAll<HTMLButtonElement>("[data-filter]");
const works = document.querySelectorAll<HTMLElement>("[data-category]");
const resultStatus = document.querySelector<HTMLElement>(".result-status")!;
const empty = document.querySelector<HTMLElement>("#works .empty-state")!;

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    let count = 0;
    filters.forEach((filter) =>
      filter.setAttribute("aria-pressed", String(filter === button)),
    );
    works.forEach((work) => {
      const visible = category === "all" || work.dataset.category === category;
      work.hidden = !visible;
      if (visible) count++;
    });
    resultStatus.textContent = `正在展示${category === "all" ? "全部 " : `${button.textContent}类 `}${count} 件作品`;
    empty.hidden = count !== 0;
  });
});
