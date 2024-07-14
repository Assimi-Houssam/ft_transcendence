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
                "Content-Type": "application/json",
                ...headers,
            },
        };
        if (!this.method_without_body.includes(method)) {
            options.body = JSON.stringify(data);
        }
        const response = await fetch(this.url + endpoint, options);
        return await response.json();
    }
}

export default new Axios();

/**
 * USAGE:
 *  import axios from "<path>/utils/axios.js";
 *  const res =  await Axios.put("/user/update", data, headers);
 *  NOTE  : headers is optional and can be used to pass additional headers 
 */
