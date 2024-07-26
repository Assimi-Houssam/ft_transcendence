import { router } from "../routes/routes.js";
import ApiWrapper from "./ApiWrapper.js";

export const logout = () => {
    ApiWrapper.post("/logout")
    router.navigate("/login");
}
