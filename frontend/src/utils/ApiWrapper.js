import { router } from "../routes/routes.js";

class ApiWrapper {
    constructor() {
        this.url = "https://localhost:8000";
        this.wsUrl = "wss://localhost:8000"
        this.public_routes = ["/login", "/login/refresh", "/register", "/oauth-login"];
    }
    getUrl() {
        return this.url;
    }
    getWsUrl() {
        return this.wsUrl;
    }
    async get(endpoint) {
        return this.request("GET", endpoint, null);
    }
    async post(endpoint, data = {}, json = true) {
        return this.request("POST", endpoint, data, json);
    }

    async put(endpoint, data = {}) {
        return this.request("PUT", endpoint, data);
    }
    async delete(endpoint) {
        return this.request("DELETE", endpoint, null);
    }
    async request(method, endpoint, data, json = true) {
        let headers = {};
        if (json)
            headers["Content-Type"] = "application/json";
        const options = {
            method,
            headers: headers,
            credentials: 'include'
        };
        if (data)
            options.body = json ? JSON.stringify(data) : data;
        const response = await fetch(this.url + endpoint, options);
        if (response.status === 401) {
            router.navigate("/login");
            return null;
        }
        if (this.public_routes.includes(endpoint) || response.status !== 401)
            return response
        return null;
    }
}

export default new ApiWrapper();
