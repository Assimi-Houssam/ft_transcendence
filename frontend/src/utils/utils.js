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