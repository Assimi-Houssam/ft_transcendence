import { ForgotPasswordPage } from "../pages/ForgotPassword.js";
import { LoginPage } from "../pages/Login.js";
import { RegistrationPage } from "../pages/Registration.js";
import { HomePage } from "../pages/Home.js"
import { isAuthenticated } from "../utils/utils.js";
import { SettingsPage } from "../pages/SettingsPage.js";
import { logout } from "../utils/logout.js";
import { ChatContainer } from "../pages/ChatContainer.js";
import {Test} from "../pages/Test.js";
import Error404 from "../error/404.js";
import { LayoutWrapper } from "../components/LayoutComponent.js";
import { GameSelection } from "../pages/GameSelectionMenu.js";
import { OfflineRoom } from "../components/GameComponents/GameOfflineRoom/OfflineRoom.js";
import { RoomsListPage } from "../pages/RoomsListPage.js";
import { RoomPage } from "../pages/RoomPage.js";

export const Routes = [
    {
        path: '/404',
        component: Error404,
    },
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
        component: ChatContainer,
    },
    {
        path: '/test/:id',
        component: Test,
    },
    {
        path: '/game-selection',
        icon: '../assets/icons/game.png',
        icon_ac: '../assets/icons/active_game.png',
        component: GameSelection,
        // subs: [
        //     {
        //         path: '/offline-room-1vs1',
        //         component: RoomOneVsOne,
        //     }
        // ]
    },
    {
        path : "/tournament",
        component : OfflineRoom,
    },
    {
        path: "/rooms",
        component: RoomsListPage,
    },
    {
        path: "/room/:id",
        component: RoomPage
    },
    {
        path: '/logout',
        component: null,
        service: logout,
    },
]

class Router {
    constructor() {
        this.routes = Routes;
        this.active_path = window.location.pathname;
        this.route  = this.routes.find(route => route.path === this.active_path);
        this.public_routes = ["/login", "/register", "/reset-password"];
        this.active_page = null;
    }

    findSubpath(path, routes = this.routes) {
        const pathSegments = path.split('/').filter(Boolean);

        for (const route of routes) {
            const routeSegments = route.path.split('/').filter(Boolean);
            if (routeSegments.length !== pathSegments.length)  continue;

            let isMatch = true, params = {};

            for (let i = 0; i < routeSegments.length; i++) {
                if (routeSegments[i].startsWith(':')) 
                    params[routeSegments[i].substring(1)] = pathSegments[i];
                else if (routeSegments[i] !== pathSegments[i]) {
                    isMatch = false;
                    break;
                }
            }
            if (isMatch)
                return { ...route, params };
        }
        return null
    }

    render() {
        if (this.active_path != window.location.pathname) {
            window.history.pushState({}, "", this.active_path);
        }
        const root = document.getElementById("root");
        if (!this.active_page)
            this.active_page = new this.route.component();
        root.innerHTML = "<app-loader></app-loader>";
        if (this.public_routes.includes(this.route.path)) {
            root.innerHTML = this.active_page.outerHTML;
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
                    content_.replaceChildren(this.active_page);
                }
            })
            // fixme: if fetch throws, everything will break, gotta refactor how errors are handled in the load methods
            .catch(error => {
                console.log("[routes]: layout threw:", error);
                console.log("[routes]: redirecting to /login");
                localStorage.clear();
                this.navigate("/login");
            });
        }
    }

    async navigate(path, customInstance = null) {
        if (path === "/")
            path = "/home";
        const isLogged = await isAuthenticated();
        if (!isLogged && !this.public_routes.includes(path)) {
            path = "/login";
        }
        if (isLogged && this.public_routes.includes(path)) {
            path = "/home";
        }
        this.active_path = path;
        this.route = this.findSubpath(path);
        if (!this.route)
            this.navigate("/404");
        if (this.route && this.route.service) {
            this.route.service();
            return;
        }
        this.active_page = customInstance;
        this.render();
    }
}

window.onpopstate = () => {
    router.navigate(window.location.pathname);
}

export const router = new Router();