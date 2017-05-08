import { handleActions } from 'redux-actions';
import { userActions } from '../actions';

// In milliseconds
const SESSION_CACHE_DURATION = 24 * 60 * 60 * 1000;

const {SESSION_INITIALIZED, SESSION_INVALIDATED} = userActions;

const user = handleActions({
    [SESSION_INITIALIZED]: (state, action) => {
        const {firstName, lastName, email, sessionToken} = action.payload;
        return Object.assign({}, state, {
            firstName,
            lastName,
            email,
            sessionToken,
            sessionValidUntil: Date.now() + SESSION_CACHE_DURATION
        });
    },

    [SESSION_INVALIDATED]: (state, action) => {
        return Object.assign({}, state, {
            sessionToken: '',
            sessionValidUntil: 0
        });
    }
}, {
    firstName: '',
    lastName: '',
    email: '',
    sessionToken: '',
    sessionValidUntil: 0
});

export default user;
