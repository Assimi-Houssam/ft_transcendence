import { router } from "../routes/routes.js";
export const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.navigate("/login");
}
