import { router } from "../routes/routes.js";

export class Sidebar extends HTMLElement {
    constructor() {
        super();
        this.classList.add("sidebar_");
    }

    connectedCallback() {
        let sidebar_links = ["/"]; // add the name of the sidebar routes paths here
        this.innerHTML = `
        <div class="logo_"> 
            <img src="./assets/images/logo.png" alt="logo" />
        </div>
        <div class="sidebar_links">
            ${sidebar_links.map((link) => {
            let route = router.routes.find((r) => r.path === link);
            return `<a
                        href="${route.path}"
                        class="${route.path === window.location.pathname ? "active_link" : ""}"
                    > 
                        <img 
                            src="${route.path === window.location.pathname ? route.icon_ac : route.icon}"
                            alt="${route.path}" 
                        />
                    </a>`;
            })}
        </div>
    `;
    }
}
