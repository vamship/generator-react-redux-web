import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import routes from '../routes';

const _loginPath = routes.login.getPath();

/**
* Wrapper for a protected react router route that only renders the target
* component if the user is authenticated.
 *
 * @extends {React.Component}
 */
class ProtectedRouteComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {isUserAuthenticated, component: Component, ...routeParams} = this.props;

        const renderComponent = isUserAuthenticated ?
            props => <Component {...props} /> :
            props => <Redirect to={ { pathname: _loginPath, state: { from: props.location } } } />;

        return <Route {...routeParams} render={ renderComponent } />;
    }
}

ProtectedRouteComponent.propTypes = {
    isUserAuthenticated: PropTypes.bool.isRequired,
    component: PropTypes.func.isRequired
};

export default ProtectedRouteComponent;
