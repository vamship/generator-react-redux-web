import { takeEvery, delay } from 'redux-saga';
import { put, fork, select, call } from 'redux-saga/effects';

import ApiClient from './utils/api-client';
import { loginActions, userActions } from '../actions';

const {LOGIN, LOGIN_IN_PROGRESS, LOGIN_SUCCEEDED, LOGIN_FAILED} = loginActions;
const {LOGOUT, LOGOUT_IN_PROGRESS, LOGOUT_SUCCEEDED, LOGOUT_FAILED} = loginActions;
const {SESSION_INITIALIZED, SESSION_INVALIDATED} = userActions;

function* doLogin(action) {
    const {email, password} = action.payload;
    const inProgress = yield select(state => state.login.isLoginInProgress);

    if (inProgress) {
        return;
    }
    yield put(LOGIN_IN_PROGRESS('logging you in ...'));

    try {
        const apiClient = new ApiClient('/login');
        const result = yield apiClient.post({}, {
            email,
            password
        }, {});

        yield put(SESSION_INITIALIZED({
            firstName: result.firstName,
            lastName: result.lastName,
            email,
            sessionToken: result.sessionToken
        }));

        yield put(LOGIN_SUCCEEDED());
    } catch (ex) {
        yield put(LOGIN_FAILED('Login failed. Can you check your inputs and try again?'));
    }
}

function* doLogout(action) {
    const inProgress = yield select(state => state.login.isLogoutInProgress);

    if (inProgress) {
        return;
    }
    yield put(LOGOUT_IN_PROGRESS('logging you out ...'));

    try {
        //TODO: Dummy async call should be cleaned up.
        yield call(delay, 2000);

        // TODO: Other operations could go here
        yield put(SESSION_INVALIDATED());
        yield put(LOGOUT_SUCCEEDED());
    } catch (ex) {
        yield put(LOGOUT_FAILED('Logout failed. Can you check your inputs and try again?'));
    }
}

export default function* () {
    yield[
        fork(takeEvery, LOGIN.toString(), doLogin),
        fork(takeEvery, LOGOUT.toString(), doLogout)
    ];
}
