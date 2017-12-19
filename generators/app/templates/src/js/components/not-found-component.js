import React from 'react';

/**
 * Content for routes that were not matched.
 */
class NotFoundComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className="pt6 pb4 center measure ph3 relative">
                 <h1 className="ttu">Page Not Found</h1>
                 <span className="f6 text-secondary">We could not find the page that you were looking for.</span>
               </div>;
    }
}

export default NotFoundComponent;
