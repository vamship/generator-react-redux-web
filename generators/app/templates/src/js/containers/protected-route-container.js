import { connect } from 'react-redux';

import ProtectedRouteComponent from '../components/protected-route-component';
import authUtils from '../utils/auth-utils';

const mapStateToProps = function(state, ownProps) {
    return {
        isUserAuthenticated: authUtils.isUserAuthenticated(state),
        ...ownProps
    };
};

const mapDispatchTopProps = function(dispatch, ownProps) {
    return {
    };
};

const ProtectedRouteContainer = connect(
    mapStateToProps,
    mapDispatchTopProps
)(ProtectedRouteComponent);

export default ProtectedRouteContainer;
