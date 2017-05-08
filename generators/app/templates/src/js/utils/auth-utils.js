/**
 * Helper module that exposes methods for user authentication and authorization.
 */
const authUtils = {
    /**
     * Checks if the user is authenticated based on current state.
     *
     * @param {Object} state A reference to the redux state.
     *
     * @return {Boolean} True if the user is authenticated, false otherwise.
     */
    isUserAuthenticated: function(state) {
        const {user: {sessionToken, sessionValidUntil}} = state;
        return !!sessionToken && sessionValidUntil > Date.now();
    }
};

export default authUtils;
