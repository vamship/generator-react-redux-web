import { applyMiddleware as reduxApplyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import sagas from './sagas';
import { loggingEnabled } from '../config';

const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger({
    collapsed: true
});

/**
 * Exports a list of redux middlewares to add to the redux store.
 */
export function applyMiddleware() {
    if (loggingEnabled) {
        return reduxApplyMiddleware(
            sagaMiddleware,
            loggerMiddleware
        );
    } else {
        return reduxApplyMiddleware(
            sagaMiddleware
        );
    }
}

/**
 * Kicks off any middleware specific tasks after initialization.
 */
export function startupMiddleware() {
    sagaMiddleware.run(sagas);
}
