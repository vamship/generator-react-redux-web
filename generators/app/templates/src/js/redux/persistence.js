import { Promise } from 'bluebird';
import { persistStore } from 'redux-persist';
import createFilter from 'redux-persist-transform-filter';

const userFilter = createFilter('user', [
    'email',
    'firstName',
    'lastName'
]);

const navFilter = createFilter('nav', [
    'redirectUrl'
]);

/**
 * Sets up store persistence, allowing the application state to be restored
 * even after the browser window is closed and reopened.
 *
 * @param {Object} store Reference to the initialized redux store.
 *
 * @return {Promise} A promise that will be fulfilled after the
 *         store has been rehydrated.
 */
export default function setupPersistence(store) {
    if (!store || (store instanceof Array) || typeof store !== 'object') {
        throw new Error('Invalid store specified (arg #1)');
    }
    return new Promise((resolve, reject) => {
        persistStore(store, {
            transforms: [
                userFilter,
                navFilter
            ],
            // Only persist the user and nav object.
            whitelist: ['user', 'nav']
        }, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}
