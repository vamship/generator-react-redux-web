import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import ProtectedRouteContainer from '../containers/protected-route-container';
import routes from '../routes';

import AppComponent from '../components/app-component';
import NotFoundComponent from '../components/not-found-component';
import LoginContainer from '../containers/login-container';
import LogoutContainer from '../containers/logout-container';

/**
 * Root component for the app.
 */
class AppRootComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isReady: false
        };
    }

    componentDidMount() {
        this.props.readyToRender.then(() => {
            this.setState({
                isReady: true
            });
        });
    }

    render() {
        const props = this.props;
        const state = this.state;

        if (!state.isReady) {
            return <div style={ { position: 'absolute', top: '10%', left: '50%' } }>
                     <div>
                       Initializing ...
                     </div>
                   </div>;
        }
        return <Provider store={ props.store }>
                 <Router>
                   <Switch>
                     <Route exact path={ `${routes.login}` } component={ LoginContainer } />
                     <Route exact path={ `${routes.logout}` } component={ LogoutContainer } />
                     <ProtectedRouteContainer path={ `${routes.home}` } component={ AppComponent } />
                     <Redirect from='/' to={ `${routes.home}` } />
                     <Route path="*" component={ NotFoundComponent } />
                   </Switch>
                 </Router>
               </Provider>;
    }
}

AppRootComponent.propTypes = {
    readyToRender: PropTypes.shape({
        then: PropTypes.func.isRequired
    }).isRequired,
    store: PropTypes.object.isRequired
};

export default AppRootComponent;
