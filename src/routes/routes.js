import Home from "../pages/Home.js"

export const Routes = [
    {
        path : '/',
        icon : '../assets/icons/home.png',
        icon_ac : '../assets/icons/active_home.png',
        component : Home
    }
]

class Router {
    constructor() {
        this.routes = Routes;
        this.active_path = window.location.pathname;
        this.route  = this.routes.find(route => route.path === this.active_path);
    }

    render() {
        const layout = document.querySelector("layout-wrraper");
        const content_ = layout.querySelector(".content_body_");
        content_.innerHTML = this.route.component().outerHTML;
    }

    navigate(path) {
        this.active_path = path;
        this.route = this.routes.find(route => route.path === this.active_path);
        this.render();
    }
}

export const router = new Router();