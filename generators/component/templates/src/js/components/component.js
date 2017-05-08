import React from 'react';
import PropTypes from 'prop-types';

/**
 * <%= componentName %> component.
 */
class <%= componentClass %> extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //TODO: Define state here.
        };
    }

    render() {
        const props = this.props;
        const state = this.state;

        //TODO: Render the component
        return <div><%= componentName %></div>;
    }
}

<%= componentClass %>.propTypes = {
    //TODO: Define props validations here.
};

export default <%= componentClass %>;
