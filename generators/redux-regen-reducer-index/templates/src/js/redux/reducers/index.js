/**
 * BE CAREFUL!!
 * This file has been auto generated by the yeoman generator:
 *  <%= generatorName %>
 * Any manual changes made to its contents could be overwritten by the
 * yeoman generator when it is run again.
 */
import { combineReducers } from 'redux';

<% reducerList.forEach((reducer) => { -%>
import <%= reducer.definitionVar -%> from './<%= reducer.fileName -%>';
<% }) -%>

const rootReducer = combineReducers({
<% reducerList.forEach((reducer, index) => { -%>
    <%= reducer.reducerVar %>: <%= reducer.definitionVar %><%= (index < reducerList.length - 1)? ',\n':'\n' -%>
<% }) -%>
});

export default rootReducer;
