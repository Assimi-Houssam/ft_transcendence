import { router } from "./routes.js";

// remove the default behavior of the anchor (<a>) tags and added a event to navigate to the clicked link
// todo: move this somewhere else
document.body.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    event.preventDefault();
    const targetHref = event.target.closest("a").getAttribute("href");
    router.navigate(targetHref);
    // check if is the sidebar link and change the active link
    if (event.target.closest(".sidebar_links")) {
      const sidebar_links = document.querySelectorAll(".sidebar_links a");
      sidebar_links.forEach((link) => {
        link.classList.remove("active_link");
        link.querySelector("img").src = router.routes.find((r) => r.path === link.getAttribute("href")).icon;
      });
      event.target.closest("a").classList.add("active_link");
      event.target.closest("a").querySelector("img").src = router.route.icon_ac;
    }
  }
});

console.log(`index.js, url: ${window.location.search} | pathname: ${window.location.pathname}`);
router.navigate(window.location.pathname);
