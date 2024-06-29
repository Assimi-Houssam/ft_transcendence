export const checkAuth = () => {
    /** TODO: complete implementation of this function
     * Check if the user is authenticated
     * @returns {boolean} true if the user is authenticated, false otherwise
     * token need to be also checked if it's expired or not and if it's valid
     */
    const token = localStorage.getItem('token');
    if (token)
        return true;
    return false;
}