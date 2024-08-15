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
import { OnlineRoomList } from "../components/GameComponents/GameOnlineRoom/OnlineRoomList.js";
import { Rooms } from "../components/GameComponents/GameOnlineRoom/Rooms.js";

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
        subs : [
            {
                path: '/start',
                component: Test,
            }
        ]
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
        path : "/rooms",
        component : OnlineRoomList,
    },
    {
        path : "/rooms2",
        component : Rooms,
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
    }


    findSubpath(path, routes = this.routes) {
        const pathSegments = path.split(/\/(?=.)/);
        pathSegments[0] === "" && pathSegments.shift();
        if (pathSegments.length === 0)  return null;

        for (let i = 0; i < pathSegments.length; i++) {
            if (pathSegments[i])
                pathSegments[i]  = "/" + pathSegments[i];
        }

        const route = routes.find(route => route.path === pathSegments[0]);
        if (!route) return null;
    
        if (pathSegments.length > 1) {
            const remainingPath = pathSegments.slice(1).join("/");
            return this.findSubpath(remainingPath, route.subs);
        }
        return route;
    }

    render() {
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
            // fixme: if fetch throws, everything will break, gotta refactor how errors are handled in the load methods
            .catch(error => {
                console.log("[routes]: layout threw:", error);
                console.log("[routes]: redirecting to /login");
                localStorage.clear();
                this.navigate("/login");
            });
        }
    }

    async navigate(path) {
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
        this.render();
    }
}

window.onpopstate = () => {
    router.navigate(window.location.pathname);
}

export const router = new Router();
