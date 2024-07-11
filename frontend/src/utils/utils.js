/** TODO: complete implementation of this function
 * Check if the user is authenticated
 * @returns {boolean} true if the user is authenticated, false otherwise
 * token need to be also checked if it's expired or not and if it's valid
 */

export const isAuthenticated = () => !!localStorage.getItem('access_token');

// temporary
export async function synchronousFetch(url, method, params, header, exception_handler = () => {}) {
    const request_options = {
        method: method,
        headers: header,
        body: params
    };
    const resp = await fetch(url, request_options);
    return resp;
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
    let ret = "";
    localStorage.clear();
    if (local_state != ft_state) {
        return "OAuth state mismatch";
    }
    else {
        const oauth_data = { code: auth_code, state: local_state }
        const headers = { 'Content-Type': 'application/json' }
        try {
            const response = await fetch("http://localhost:8000/oauth-login", {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(oauth_data)
            });
            const data = await response.json();
            if ('error' in data) {
                ret = data.error;
            }
            else {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                console.log(`OAuthIntercept: tokens set!`);
            }
        } catch (error) {
            console.log('There was a problem with the fetch operation: ' + error.message);
        }
    }
    return ret;
}