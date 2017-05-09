import React from 'react';
import { Link } from 'react-router-dom';

import eventUtils from '../utils/event-utils';
import routes from '../routes';

const _homePath = routes.home.getPath();
const _logoutPath = routes.logout.getPath();

/**
 * Header component for the app.
 */
class HeaderComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isMenuOpen: false
        };
        this.onMenuClick = eventUtils.createDomEventHandler(() => {
            this.setState({
                isMenuOpen: !this.state.isMenuOpen
            });
        });
        this.onNavLinkClick = eventUtils.createDomEventHandler(() => {
            this.setState({
                isMenuOpen: false
            });
            return true;
        }, true);
    }

    render() {
        const state = this.state;

        const menuClass = state.isMenuOpen ? 'open db' : '';
        return <header className="bg-primary br0 dt-l relative w-100 z-9999">
                 <nav className="bg-primary dt dtc-l w-100 center cf-m cf-l nav">
                   <div className="bg-primary b-primary text-primary fl-l pl20px dtc w-100 w-auto-l db-l v-mid relative bb bn-l z-9999">
                     <Link className="logo db p0 border-box pointer" to={ _homePath }>
                       <%= websiteTitle %>
                     </Link>
                   </div>
                   <span className={ `menu-button p0 m0 bg-primary text-primary dtc dn-l v-mid tc f6 bl bb b-primary fr z-9999 relative pointer ${menuClass}` } onClick={ this.onMenuClick }>Menu</span>
                   <div className={ `fr-l dn db-l v-mid tc tr-l fixed relative-l w-100 w-auto-l left-0 menu z-999 ${menuClass}` }>
                     <div className="absolute static-l menu-container w-100 w-50-m bg-primary right-0 tl-m">
                       <Link onClick={ this.onNavLinkClick } className="bg-primary text-primary bb bn-l b-primary fw5 db dib-l pv2 pv0-l pr3 ph3-m dim" to={ _logoutPath }>
                         Log Out
                       </Link>
                     </div>
                   </div>
                 </nav>
               </header>;
    }
}

export default HeaderComponent;
