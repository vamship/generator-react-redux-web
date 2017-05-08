import { Promise } from 'bluebird';
import { createStore as createReduxStore, compose } from 'redux';
import { autoRehydrate } from 'redux-persist';

import { applyMiddleware, startupMiddleware } from './middleware';
import setupPersistence from './persistence';
import rootReducer from './reducers';

const _storeReadyResolver = {
    resolve: null,
    reject: null
};

/**
 * A promise object that will be resolved when the redux store has been
 * initialized and is ready for use.
 */
export const storeReady = new Promise((resolve, reject) => {
    _storeReadyResolver.resolve = resolve;
    _storeReadyResolver.reject = reject;
});

/**
 * Initializes the redux store with the following:
 *  - Reducers defined for the application
 *  - State persistence using redux-persist
 *  - Saga middleware
 *  - Logger middleware
 *
 * @param {Object} [preloadedState] A state object containing the initial
 *        application state object.
 *
 * @return {Object} A fully initialized state object.
 */
export default function createStore(preloadedState) {
    // Initialize store.
    const store = createReduxStore(
        rootReducer,
        preloadedState,
        compose(
            autoRehydrate(),
            applyMiddleware()
        )
    );

    // Setup store persistence.
    setupPersistence(store).then((data) => {
        _storeReadyResolver.resolve(data);
    }, (err) => {
        _storeReadyResolver.reject(err);
    });

    // Startup middlewares (any that require starting up)
    startupMiddleware();

    return store;
}
