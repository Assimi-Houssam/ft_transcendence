import ApiWrapper from "./ApiWrapper.js";


export async function isAuthenticated() {
    const req = await ApiWrapper.get("/me");
    return req;
}

export function genRandomString(length) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').substr(0, length);
}

export async function OAuthIntercept() {
    const url = new URL(document.URL);
    const local_state = localStorage.getItem('state');
    const ft_state = url.searchParams.get('state');
    const auth_code = url.searchParams.get('code');
    localStorage.clear();
    if (local_state != ft_state) {
        return "OAuth state mismatch";
    }
    const oauth_data = { code: auth_code, state: local_state }
    try {
        const req = await ApiWrapper.post("/oauth-login", oauth_data);
        const data = await req.json();
        if (req.status === 500)
            return "An internal server error occured";
        if (!req.ok)
            return data.detail;

    }
    catch (error) {
        return "An exception has occured";
    }
    return "";
}

let userInfo = null;

export function getRawUserInfo() {
    return userInfo;
}

export async function getUserInfo() {
    if (userInfo)
        return userInfo;
    const req = await ApiWrapper.get("/me");
    if (!req.ok)
        return null;
    userInfo = await req.json();
    return userInfo;
}

export async function forceUpdateUserInfo() {
    const req = await ApiWrapper.get("/me");
    if (!req.ok)
        return null;
    userInfo = await req.json();
    return userInfo;
}

export function resetUserInfo() {
    userInfo = null;
}