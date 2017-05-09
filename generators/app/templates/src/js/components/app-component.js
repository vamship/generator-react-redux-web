import React from 'react';
import { Route } from 'react-router-dom';

import HeaderComponent from './header-component';
import HomeComponent from '../components/home-component';
import routes from '../routes';

/**
 * Main page for the app after authentication.
 */
class AppComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
                 <HeaderComponent />
                 <Route exact path={ `${routes.home}` } component={ HomeComponent } />
               </div>;
    }
}

export default AppComponent;
