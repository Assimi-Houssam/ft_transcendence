import Toast from "../../components/Toast.js";
import Axios from "../axios.js";

/**
 * @description Get user information form the server
 * @returns {Object} userInfo
 */
export default async function userInfo() {
    try {
        let headers = {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
        const res = await Axios.get("me", {
            headers: headers
        });
        return res;
    } catch(err) {
        console.log("[bad - userInfo.services] => ", err);
        Toast.error(err);
    }
}
