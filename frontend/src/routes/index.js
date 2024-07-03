import { isAuthenticated } from "../utils/utils.js";
import { router, public_paths } from "./routes.js";
import { synchronousFetch } from "../utils/utils.js";

// remove the default behavior of the anchor (<a>) tags and added a event to navigate to the clicked link
// todo?: fix this since clicking an img tag in the sidebar would result in a page redirect
document.body.addEventListener("click", (event) => {
  if (event.target.tagName.toLowerCase() === "a") {
    event.preventDefault();
    if (!public_paths.includes(event.target.getAttribute("href")) && !isAuthenticated()) {
      router.navigate("/login");
    }
    else if (isAuthenticated() && public_paths.includes(event.target.getAttribute("href"))) {
      router.navigate("/home");
    }
    else {
      router.navigate(event.target.getAttribute("href"));
    }
  }
});

//set an event for the sidebar links to change the active link style
const sidebar_links = document.querySelectorAll(".sidebar_links a");
sidebar_links.forEach((link) => {
  link.addEventListener("click", (e) => {
    sidebar_links.forEach((l) => {
      l.classList.remove("active_link");
      l.querySelector("img").src = router.route.icon
    });
    link.classList.add("active_link");
    link.querySelector("img").src = router.route.icon_ac;
  });
});

// todo: refactor this, and move it somewhere else
if (localStorage.getItem('state')) {
  const url = new URL(document.URL);
  const local_state = localStorage.getItem('state');
  const ft_state = url.searchParams.get('state');
  const auth_code = url.searchParams.get('code');
  localStorage.clear();
  if (local_state != ft_state) {
    router.navigate("/login");
    let err = document.getElementById("login-error-message");
    err.textContent = "OAuth state mismatch";
  }
  else {
    const oauth_data = { code: auth_code, state: local_state }
    const headers = { 'Content-Type': 'application/json' }
    const resp = await synchronousFetch("http://localhost:8000/oauth-login", 'POST', JSON.stringify(oauth_data), headers);
    const json_resp = await resp.json();
    if ('error' in json_resp) {
      router.navigate("/login");
      let err = document.getElementById("login-error-message");
      err.textContent = "An internal server error occured";
    }
    else {
      const access_token = json_resp.access;
      const refresh_token = json_resp.refresh;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      router.navigate("/home");
    }
  }
}
else if (!isAuthenticated() && !public_paths.includes(window.location.pathname)) {
  console.log("user is not authenticated, redirecting to /login");  
  router.navigate("/login");
}
else {
  router.navigate("/home");
}