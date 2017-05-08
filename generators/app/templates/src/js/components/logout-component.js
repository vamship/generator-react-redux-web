import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

/**
 * Logout component.
 */
class LogoutComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.handleLogout();
    }

    render() {
        const props = this.props;
        if (!props.isUserAuthenticated) {
            // Redirect to login page once logout is complete.
            return <Redirect to={ props.redirectUrl } />;
        }

        return <div className="pt6 pb4 center measure ph3 relative">
                 <div className="mt3">
                   { props.isLogoutInProgress && <div className="w-100 center mb3 spinner-medium"></div> }
                   { props.logoutMessage.length > 0 &&
                     <small className="f6 text-accent tc w-100 dib">{ props.logoutMessage }</small> }
                 </div>
               </div>;
    }
}

LogoutComponent.propTypes = {
    isLogoutInProgress: PropTypes.bool.isRequired,
    logoutMessage: PropTypes.string.isRequired,
    isUserAuthenticated: PropTypes.bool.isRequired,
    redirectUrl: PropTypes.string,

    handleLogout: PropTypes.func.isRequired
};

export default LogoutComponent;
