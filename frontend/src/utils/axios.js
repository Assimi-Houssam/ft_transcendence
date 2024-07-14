class Axios {
    constructor() {
        this.url = "http://localhost:8000/";
        this.headers = {};
    }

    async get(...args) {
        return await this.request("GET", ...args);
    }

    async post(...args) {
        return await this.request("POST", ...args);
    }

    async put(...args) {
        return await this.request("PUT", ...args);
    }

    async delete(...args) {
        return await this.request("DELETE", ...args);
    }

    async request(method, endpoint, data = {}, headers = {}) {
        const response = await fetch(this.url + endpoint, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...this.headers,
                ...headers,
            },
            body: JSON.stringify(data),
        });
        return await response.json();
    }
}

export default new Axios();