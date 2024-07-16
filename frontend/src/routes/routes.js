import { ForgotPasswordPage } from "../pages/ForgotPassword.js";
import { LoginPage } from "../pages/Login.js";
import { RegistrationPage } from "../pages/Registration.js";
import { HomePage } from "../pages/Home.js"
import { isAuthenticated } from "../utils/utils.js";
import { SettingsPage } from "../pages/SettingsPage.js";
import { logout } from "../utils/logout.js";
import { ChatContainer } from "../pages/ChatContainer.js";
import { LayoutWrapper } from "../components/LayoutComponent.js";
import { ErrorPage } from "../pages/Error.js"

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

    async render() {
        if (this.active_path != window.location.pathname) {
            window.history.pushState({}, "", this.active_path);
        }
        const root = document.getElementById("root");
        const curr_page = new this.route.component();
        root.innerHTML = "<app-loader></app-loader>";
        if (this.public_routes.includes(this.route.path)) {
            root.innerHTML = curr_page.outerHTML;
            return;
        }
        let layout = document.querySelector("layout-wrapper");
        if (!layout) {
            console.log("[routes]: layoutwrapper is null, creating it");
            layout = new LayoutWrapper();
            console.log("[routes]: loading layoutwrapper");
            layout.load();
            layout.isLoaded().then(() => {
                console.log("[routes]: layout loaded successfully, calling replaceChildren on root");
                root.replaceChildren(layout);
                const content_ = layout.querySelector(".content_body_");
                if (content_) {
                    content_.replaceChildren(curr_page);
                }
            })
            .catch(error => {
                console.log("[routes]: layout threw:", error);
                console.log("[routes]: redirecting to /login");
                localStorage.clear();
                this.navigate("/login");
            });
        }
    }

    navigate(path) {
        if (path === "/" || !this.routes.some(route => route.path === path)) {
            path = "/home";
        }
        if (!isAuthenticated() && !this.public_routes.includes(path)) {
            path = "/login";
        }
        if (isAuthenticated() && this.public_routes.includes(path)) {
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
