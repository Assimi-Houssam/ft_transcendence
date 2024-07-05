import { isAuthenticated } from "../utils/utils.js";
import { router, public_paths } from "./routes.js";
import { synchronousFetch } from "../utils/utils.js";

/**
 * when user refreshed the page  it not showing the component,
 * so we need to navigate to the current path
 * also since the home path is /home, and user want to access  home page from root "/" we need to navigate to /home
 */
if (window.location.pathname === "/")
  router.navigate("/home");
else
  router.navigate(window.location.pathname);

// todo?: fix this since clicking an img tag in the sidebar would result in a page redirect
// remove the default behavior of the anchor (<a>) tags and added a event to navigate to the clicked link
document.body.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    event.preventDefault();
    const targetHref = event.target.closest("a").getAttribute("href");
    if (!public_paths.includes(targetHref) && !isAuthenticated()) {
      router.navigate("/login");
    } else if (isAuthenticated() && public_paths.includes(targetHref)) {
      router.navigate("/home");
    } else {
      router.navigate(targetHref);
    }
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
  router.navigate(window.location.pathname);
}