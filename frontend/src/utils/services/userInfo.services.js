import Toast from "../../components/Toast.js";
import ApiWrapper from "../ApiWrapper.js";

/**
 * @description Get user information form the server
 * @returns {Object} userInfo
 */
export default async function userInfo() {
    try {
        const res = await ApiWrapper.get("/me");
        const data = await res.json();
        return data;
    } catch(err) {
        Toast.error(err);
    }
}
