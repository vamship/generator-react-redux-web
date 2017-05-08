import { connect } from 'react-redux';

import LoginComponent from '../components/login-component';
import { loginActions } from '../redux/actions';
import authUtils from '../utils/auth-utils';
import routes from '../routes';

const _homePath = routes.home.getPath();

const mapStateToProps = function(state, ownProps) {
    const {isLoginInProgress, loginMessage} = state.login;

    const routeState = (ownProps.location || {}).state || {};
    const redirectUrl = (routeState.from || {}).pathname || _homePath;

    return {
        isLoginInProgress,
        loginMessage,
        isUserAuthenticated: authUtils.isUserAuthenticated(state),
        redirectUrl
    };
};

const mapDispatchTopProps = function(dispatch, ownProps) {
    return {
        handleLogin: (email, password) => {
            dispatch(loginActions.LOGIN({
                email,
                password
            }));
        }
    };
};

const LoginContainer = connect(
    mapStateToProps,
    mapDispatchTopProps
)(LoginComponent);

export default LoginContainer;
