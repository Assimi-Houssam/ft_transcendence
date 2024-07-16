class ApiWrapper {
    constructor() {
        this.url = "http://localhost:8000";
        this.public_routes = ["/login", "/login/refresh", "/register", "/oauth-login"];
    }

    async get(endpoint) {
        return this.request("GET", endpoint, null);
    }

    async post(endpoint, data = {}) {
        return this.request("POST", endpoint, data);
    }

    async put(endpoint, data = {}) {
        return this.request("PUT", endpoint, data);
    }

    async delete(endpoint) {
        return this.request("DELETE", endpoint, null);
    }
    async refresh_token() {
        const data = {
            refresh: localStorage.getItem("refresh_token")
        }
        const req_opt = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        const req = await fetch(this.url + "/login/refresh", req_opt);
        if (!req.ok) {
            return false;
        }
        const json = await req.json();
        console.log("[ApiWrapper]: new token: ", json.access);
        localStorage.setItem("access_token", json.access);
        return true;
    }
    async request(method, endpoint, data) {
        console.log("[ApiWrapper]: sending a", method, "request to:", endpoint);
        let headers = {
            "Content-Type": "application/json"
        };
        if (!this.public_routes.includes(endpoint))
            headers["Authorization"] = `Bearer ${localStorage.getItem("access_token")}` 
        const options = {
            method,
            headers: headers
        };
        if (data) {
            console.log("data is not empty!");
            options.body = JSON.stringify(data);
        }
        console.log("[ApiWrapper]: data:", JSON.stringify(data));
        console.log("[ApiWrapper]: headers:", JSON.stringify(headers));
        const response = await fetch(this.url + endpoint, options);
        if (this.public_routes.includes(endpoint) || response.status != 401)
            return response
        console.log("[ApiWrapper]: token expired, refreshing the token");
        const refreshed = await this.refresh_token();
        if (refreshed) {
            console.log("[ApiWrapper]: token refreshed successfully");
            headers["Authorization"] = `Bearer ${localStorage.getItem("access_token")}`;
            const response = await fetch(this.url + endpoint, options);
            return response;
        }
        console.log("[ApiWrapper]: an error occured, most likely the user needs to login again");
        return null;
    }
}

export default new ApiWrapper();
