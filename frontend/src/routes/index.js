import { router } from "./routes.js";


// remove the default behavior of the anchor (<a>) tags and added a event to navigate to the clicked link
document.body.addEventListener("click", (event) => {
  if (event.target.tagName.toLowerCase() === "a") {
    event.preventDefault();
    router.navigate(event.target.getAttribute("href"));
  }
});


//set an event for the sidebar links to change the active link style
const linkes_sidbar = document.querySelectorAll(".sidebar_links a");
linkes_sidbar.forEach((link) => {
  link.addEventListener("click", (e) => {
    linkes_sidbar.forEach((l) => {
      l.classList.remove("active_link");
      l.querySelector("img").src = router.route.icon
    });
    link.classList.add("active_link");
    link.querySelector("img").src = router.route.icon_ac;
  });
});

// check if the page fully loaded and render the current page
// router.navigate("/login");
