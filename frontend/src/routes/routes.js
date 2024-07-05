import { ForgotPasswordPage } from "../pages/ForgotPassword.js";
import { LoginPage } from "../pages/Login.js";
import { RegistrationPage } from "../pages/Registration.js";
import { HomePage } from "../pages/Home.js"
import { isAuthenticated } from "../utils/utils.js";
// im not sure if each should route should have a public/private entry or not, i think its cleaner this way
export const public_paths = ["/login", "/register", "/reset-password"]

export const Routes = [
    {
        path: '/home',
        icon: '../assets/icons/home.png',
        icon_ac: '../assets/icons/active_home.png',
        component: HomePage
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
    }
]

class Router {
    constructor() {
        this.routes = Routes;
        this.active_path = window.location.pathname;
        this.route  = this.routes.find(route => route.path === this.active_path);
    }

    render() {
        window.history.pushState({}, "", this.active_path);
        const root = document.getElementById("root");
        const curr_page = new this.route.component()
        if (this.route.path === '/login' || this.route.path === '/register' || this.route.path === '/reset-password') {
            root.innerHTML = curr_page.outerHTML;
        }
        else {
            let layout = document.querySelector("layout-wrapper");
            if (!layout) {
                layout = document.createElement("layout-wrapper");
                root.innerHTML = layout.outerHTML;
            }
            customElements.whenDefined('layout-wrapper').then(() => {
                const content_ = layout.querySelector(".content_body_");
                if (content_) {
                    content_.innerHTML = curr_page.outerHTML;
                }
            });

        }
    }

    navigate(path) {
        if (!public_paths.includes(path) && !isAuthenticated()) {
            router.navigate("/login")
            return;
        }
        this.active_path = path;
        this.route = this.routes.find(route => route.path === this.active_path);
        this.render();
    }
}

window.onpopstate = () => {
    router.navigate(window.location.pathname);
}

export const router = new Router();
