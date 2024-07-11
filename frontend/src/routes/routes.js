import { ForgotPasswordPage } from "../pages/ForgotPassword.js";
import { LoginPage } from "../pages/Login.js";
import { RegistrationPage } from "../pages/Registration.js";
import { HomePage } from "../pages/Home.js"
import { isAuthenticated } from "../utils/utils.js";
import { SettingsPage } from "../pages/SettingsPage.js";
import { logout } from "../utils/logout.js";
import { isPageLoaded } from "../components/Loading.js";
import { ChatContainer } from "../pages/ChatContainer.js";

export const Routes = [
    {
        path: '/home',
        icon: '../assets/icons/home.png',
        icon_ac: '../assets/icons/active_home.png',
        component: HomePage
    },
    {
        path : '/settings',
        icon: '../assets/icons/settings.png',
        icon_ac: '../assets/icons/settings_active.png',
        component: SettingsPage
    },
    {
        path: '/login',
        component: LoginPage
    },
    {
        path: '/register',
        component: RegistrationPage
    },
    {
        path: '/reset-password',
        component: ForgotPasswordPage
    },
    {
        path: '/chat',
        icon: '../assets/icons/chat.png',
        icon_ac: '../assets/icons/active_chat.png',
        component: ChatContainer
    },
    {
        path: '/logout',
        component: null,
        service: logout,
    }
]

class Router {
    constructor() {
        this.routes = Routes;
        this.active_path = window.location.pathname;
        this.route  = this.routes.find(route => route.path === this.active_path);
        this.public_routes = ["/login", "/register", "/reset-password"];
    }

    render() {
        if (this.active_path != window.location.pathname) {
            window.history.pushState({}, "", this.active_path);
        }
        const root = document.getElementById("root");
        const curr_page = new this.route.component();
        root.innerHTML = `
            <app-loader></app-loader>
        `;
        isPageLoaded().then(() => {
            root.innerHTML = "";
            if (this.public_routes.includes(this.route.path))
                root.innerHTML = curr_page.outerHTML;
            else {
                let layout = document.querySelector("layout-wrapper");
                if (!layout) {
                    layout = document.createElement("layout-wrapper");
                    root.appendChild(layout);
                }
                customElements.whenDefined('layout-wrapper').then(() => {
                    const content_ = layout.querySelector(".content_body_");
                    if (content_) {
                        content_.appendChild(curr_page);
                    }
                });
            }
        })
    }

    navigate(path) {
        if (path === "/" || !this.routes.some(route => route.path === path)) {
            path = "/home";
        }
        if (!isAuthenticated() && !this.public_routes.includes(path)) {
            console.log("redirecting to: login, user is not authed and tried to access a protected path");
            path = "/login";
        }
        if (isAuthenticated() && this.public_routes.includes(path)) {
            console.log("redirecting to: home, reason: user is authed and tried to access a public path");
            path = "/home";
        }
        this.active_path = path;
        this.route = this.routes.find(route => route.path === this.active_path);
        if (this.route.service) {
            this.route.service();
            return;
        }
        this.render();
    }
}

window.onpopstate = () => {
    router.navigate(window.location.pathname);
}

export const router = new Router();
