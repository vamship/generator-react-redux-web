import { connect } from 'react-redux';

import <%= componentClass %> from '../components/<%= containerName %>-component';

const mapStateToProps = function(state, ownProps) {
    return {
        //TODO: Generate props from state.
    };
};

const mapDispatchTopProps = function(dispatch, ownProps) {
    return {
        //TODO: Generate handlers that can dispatch messages
    };
};

const <%= containerClass %> = connect(
    mapStateToProps,
    mapDispatchTopProps
)(<%= componentClass %>);

export default <%= containerClass %>;
