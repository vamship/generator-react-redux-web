import { connect } from 'react-redux';

import LogoutComponent from '../components/logout-component';
import { loginActions } from '../redux/actions';
import authUtils from '../utils/auth-utils';
import routes from '../routes';

const _loginPath = routes.login.getPath();

const mapStateToProps = function(state, ownProps) {
    const {isLogoutInProgress, logoutMessage} = state.login;

    return {
        isLogoutInProgress,
        logoutMessage,
        isUserAuthenticated: authUtils.isUserAuthenticated(state),
        redirectUrl: _loginPath
    };
};

const mapDispatchTopProps = function(dispatch, ownProps) {
    return {
        handleLogout: (email, password) => {
            dispatch(loginActions.LOGOUT());
        }
    };
};

const LogoutContainer = connect(
    mapStateToProps,
    mapDispatchTopProps
)(LogoutComponent);

export default LogoutContainer;
