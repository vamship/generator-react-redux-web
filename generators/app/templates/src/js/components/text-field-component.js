import React from 'react';
import PropTypes from 'prop-types';
import shortId from 'shortid';

/**
 * General purpose text field for the web application. Can have app specific
 * styling applied to the elements.
 */
class TextFieldComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name || shortId.generate(),
            value: props.initialValue || '',
            errorMessage: ''
        };
    }

    /**
     * Update the value if props values are updated upstream.
     */
    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.initialValue !== this.props.initialValue) {
            this.setState({
                value: nextProps.initialValue
            });
        }
    }

    /**
     * Handle enter key press on the text field. Allow upstream components to
     * handle these events if they so choose.
     */
    onKeyPress(e) {
        if (e.key === 'Enter') {
            e.stopPropagation();
            e.preventDefault();

            const {handleEnterKeyPress} = this.props;
            if (typeof handleEnterKeyPress === 'function') {
                handleEnterKeyPress();
            }
        }
    }

    /**
     * Trigger a validation routine specified by an upstream component.
     */
    onBlur(e) {
        e.stopPropagation();
        e.preventDefault();

        const {validateInput} = this.props;
        if (typeof validateInput === 'function') {
            const {value} = this.state;
            validateInput(value);
        }
    }

    /**
     * Handle changes to the text, and notify upstream components if necessary.
     */
    onTextChange(e) {
        const value = e.target.value;
        const {handleTextChange} = this.props;
        this.setState({
            value
        });
        if (typeof handleTextChange === 'function') {
            handleTextChange(value);
        }
    }

    render() {
        const props = this.props;
        const state = this.state;
        const hasLabel = props.label && props.label.length > 0;
        const hasHint = props.hint && props.hint.length > 0;
        const hasError = props.error && props.error.length > 0;
        const hintWidthClass = hasError ? 'w-50' : 'w-100';
        const errorWidthClass = hasHint ? 'w-50' : 'w-100';

        return <div className="mb4">
                 <div>
                   { hasLabel &&
                     <label className="db fw4 mb2 fw7 lh-copy f6 text-accent dib" htmlFor={ state.name }>
                       { props.label }
                     </label> }
                   { !!props.isSpinnerVisible && <div className="dib fr spinner-small"></div> }
                 </div>
                 <input
                        className="ph3 input-reset ba w-100 b-primary ba br2 mb2"
                        autoComplete="off"
                        disabled={ !props.isEnabled }
                        placeholder={ props.placeholder }
                        type={ props.type }
                        value={ state.value }
                        name={ state.name }
                        id={ state.name }
                        onChange={ this.onTextChange.bind(this) }
                        onKeyDown={ this.onKeyPress.bind(this) }
                        onBlur={ this.onBlur.bind(this) } />
                 { hasHint &&
                   <small className={ `f7 fw4 text-secondary dib v-top ${hintWidthClass}` }>{ props.hint }</small> }
                 { hasError &&
                   <small className={ `f7 fw4 text-accent tr dib v-top ${errorWidthClass}` }>{ props.error }</small> }
               </div>;
    }
}

TextFieldComponent.propTypes = {
    name: PropTypes.string,
    type: PropTypes.oneOf(['text', 'password', 'email', 'tel']).isRequired,
    label: PropTypes.string,
    hint: PropTypes.string,
    error: PropTypes.string,
    placeholder: PropTypes.string,
    initialValue: PropTypes.string,

    isEnabled: PropTypes.bool.isRequired,
    isSpinnerVisible: PropTypes.bool,
    validateInput: PropTypes.func,
    handleTextChange: PropTypes.func,
    handleEnterKeyPress: PropTypes.func
};

export default TextFieldComponent;
