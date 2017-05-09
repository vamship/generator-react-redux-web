import { takeEvery, delay } from 'redux-saga';
import { put, fork, select, call } from 'redux-saga/effects';

import ApiClient from './utils/api-client';

//TODO: Import appropriate action modules required by the saga.
import { <%= saga%>Actions } from '../actions';

//TODO: Extract the actions from the action modules.
const { DO_SOMETHING, DO_SOMETHING_IN_PROGRESS, DO_SOMETHING_SUCCEEDED, DO_SOMETHING_FAILED } = <%= saga %>Actions;

function* doSomething(action) {
    const {doSomething} = action.payload;

    const inProgress = yield select(state => state.<%= saga%>.doSomethingInProgress);

    if (inProgress) {
        return;
    }
    yield put(DO_SOMETHING_IN_PROGRESS('doing something ...'));

    try {
        const apiClient = new ApiClient('/do-something');
        const result = yield apiClient.post({}, {
            doSomething
        }, {});

        yield put(DO_SOMETHING_SUCCEEDED({
            //TODO: Pass necessary values to the reducer.
        }));
    } catch (ex) {
        yield put(DO_SOMETHING_FAILED('Operation failed. Can you check your inputs and try again?'));
    }
}

export default function* () {
    yield[
        fork(takeEvery, DO_SOMETHING.toString(), doSomething)
    ];
}
