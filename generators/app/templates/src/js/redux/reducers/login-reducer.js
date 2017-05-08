import { handleActions } from 'redux-actions';
import { loginActions } from '../actions';

const {LOGIN_IN_PROGRESS, LOGIN_SUCCEEDED, LOGIN_FAILED} = loginActions;
const {LOGOUT_IN_PROGRESS, LOGOUT_SUCCEEDED, LOGOUT_FAILED} = loginActions;

const loginReducer = handleActions({
    [LOGIN_IN_PROGRESS]: (state, action) => {
        return Object.assign({}, state, {
            isLoginInProgress: true,
            loginMessage: action.payload
        });
    },

    [LOGIN_SUCCEEDED]: (state, action) => {
        return Object.assign({}, state, {
            loginMessage: '',
            isLoginInProgress: false
        });
    },

    [LOGIN_FAILED]: (state, action) => {
        return Object.assign({}, state, {
            loginMessage: action.payload,
            isLoginInProgress: false
        });
    },

    [LOGOUT_IN_PROGRESS]: (state, action) => {
        return Object.assign({}, state, {
            isLogoutInProgress: true,
            logoutMessage: action.payload
        });
    },

    [LOGOUT_SUCCEEDED]: (state, action) => {
        return Object.assign({}, state, {
            logoutMessage: '',
            isLogoutInProgress: false
        });
    },

    [LOGOUT_FAILED]: (state, action) => {
        return Object.assign({}, state, {
            logoutMessage: action.payload,
            isLogoutInProgress: false
        });
    }
}, {
    isLoginInProgress: false,
    loginMessage: '',
    isLogoutInProgress: false,
    logoutMessage: ''
});

export default loginReducer;
