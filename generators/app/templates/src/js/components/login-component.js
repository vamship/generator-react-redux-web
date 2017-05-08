import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';

import TextFieldComponent from './text-field-component';
import validationHelper from '../utils/validation-helper';

/**
 * Login component.
 */
class LoginComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'john.doe@example.com',
            emailMessage: '',
            password: 'Passw0rd!',
            passwordMessage: ''
        };

        this.updateEmail = (email) => {
            this.setState({
                email
            });
            this.validateEmail(email);
        };

        this.validateEmail = (email) => {
            const emailMessage = validationHelper.validateEmail(email);
            this.setState({
                emailMessage
            });
            return !emailMessage;
        };

        this.updatePassword = (password) => {
            this.setState({
                password
            });
            this.validatePassword(password);
        };

        this.validatePassword = (password) => {
            const passwordMessage = validationHelper.validatePassword(password);
            this.setState({
                passwordMessage
            });
            return !passwordMessage;
        };

        this.submitRequest = () => {
            const {email, password} = this.state;
            const isEmailValid = this.validateEmail(email);
            const isPasswordValid = this.validatePassword(password);

            if (!isEmailValid || !isPasswordValid) {
                // Client side validations failed.
                return;
            }
            this.props.handleLogin(email, password);
        };
    }

    render() {
        const props = this.props;
        const state = this.state;

        if (props.isUserAuthenticated) {
            // Don't show login if the user is already authenticated.
            return <Redirect to={ props.redirectUrl } />;
        }

        return <div className="pt6 pb4 center measure ph3 relative">
                 <Link to="/" className="db p0 border-box logo-login">
                   <%= websiteTitle %>
                 </Link>
                 <div>
                   <TextFieldComponent
                                       type="email"
                                       isEnabled={ !props.isLoginInProgress }
                                       label="Email Address"
                                       initialValue={ state.email }
                                       error={ state.emailMessage }
                                       handleEnterKeyPress={ this.submitRequest }
                                       handleTextChange={ this.updateEmail }
                                       placeholder="you@yourcompany.com" />
                   <TextFieldComponent
                                       type="password"
                                       isEnabled={ !props.isLoginInProgress }
                                       label="Password"
                                       initialValue={ state.password }
                                       error={ state.passwordMessage }
                                       handleEnterKeyPress={ this.submitRequest }
                                       handleTextChange={ this.updatePassword }
                                       placeholder="Make it good" />
                   <div className="mt3">
                     { !props.isLoginInProgress &&
                       <input
                              type="button"
                              className="btn b input-reset bn white bg-primary pointer f5 w-100 br2 mb2"
                              onClick={ this.submitRequest }
                              value="Login" /> }
                     { props.isLoginInProgress && <div className="w-100 center mb3 spinner-medium"></div> }
                     { props.loginMessage.length > 0 &&
                       <small className="f6 text-accent tc w-100 dib">{ props.loginMessage }</small> }
                   </div>
                 </div>
               </div>;
    }
}

LoginComponent.propTypes = {
    isLoginInProgress: PropTypes.bool.isRequired,
    loginMessage: PropTypes.string.isRequired,
    isUserAuthenticated: PropTypes.bool.isRequired,
    redirectUrl: PropTypes.string,

    handleLogin: PropTypes.func.isRequired
};

export default LoginComponent;
