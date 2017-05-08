import { handleActions } from 'redux-actions';
//TODO: Import appropriate action modules required by the reducer.
import { <%= reducer %>Actions } from '../actions';

//TODO: Extract the actions from the action modules.
const { DO_SOMETHING_IN_PROGRESS, DO_SOMETHING_SUCCEEDED, DO_SOMETHING_FAILED } = <%= reducer %>Actions;

const <%= reducer%>Reducer = handleActions({
    [DO_SOMETHING_IN_PROGRESS]: (state, action) => {
        return Object.assign({}, state, {
            isDoSomethingInProgress: true,
            doSomethingMessage: action.payload
        });
    },

    [DO_SOMETHING_SUCCEEDED]: (state, action) => {
        return Object.assign({}, state, {
            doSomethingMessage: '',
            isDoSomethingInProgress: false
        });
    },

    [DO_SOMETHING_FAILED]: (state, action) => {
        return Object.assign({}, state, {
            doSomethingMessage: action.payload,
            isDoSomethingInProgress: false
        });
    }
}, {
    isDoSomethingInProgress: false,
    doSomethingMessage: ''
});

export default <%= reducer%>Reducer;
