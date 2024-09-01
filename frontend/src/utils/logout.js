import { router } from "../routes/routes.js";
import ApiWrapper from "./ApiWrapper.js";
import { resetUserInfo } from "./utils.js";

export const logout = () => {
    resetUserInfo();
    ApiWrapper.post("/logout");
    router.navigate("/login");
}
