import UrlPathTemplate from './utils/url-path-template';

/**
 * Route definitions for the web application.
 */
export default {
    /**
     * Home page.
     */
    home: new UrlPathTemplate('/'),

    /**
     * Login page.
     */
    login: new UrlPathTemplate('/login'),

    /**
     * Logout page.
     */
    logout: new UrlPathTemplate('/logout')
};
