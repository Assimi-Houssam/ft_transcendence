class Axios {
    constructor() {
        this.url = "http://localhost:8000/";
        this.headers = {};
        this.method_without_body = ["GET", "DELETE"];
    }

    async get(endpoint, config = {}) {
        return await this.request("GET", endpoint, {}, config.headers);
    }

    async post(endpoint, config = {}) {
        return await this.request("POST", endpoint, config.data, config.headers);
    }

    async put(endpoint, config = {}) {
        return await this.request("PUT", endpoint, config.data, config.headers);
    }

    async delete(endpoint, config = {}) {
        return await this.request("DELETE", endpoint, {}, config.headers);
    }
    async request(method, endpoint, data = {}, headers = {}) {
        const options = {
            method,
            headers: {
                ...headers
            }
        };
        if (!this.method_without_body.includes(method)) {
            if (headers["Content-Type"] === "application/json")
                options.body = JSON.stringify(data);
            else
                options.body = data;
        }
        const response = await fetch(this.url + endpoint, options);
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(await response.json());
        }
    }
}

export default new Axios();