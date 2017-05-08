/**
 * Module that exposes utility methods relating to event handlers.
 */
const eventUtils = {
    /**
     * Creates an event handler for DOM events that suppresses event
     * propagation and then invokes the specified handler method.
     *
     * @param {Function} handler The handler that will actually handle the
     *        event.
     * @param {Boolean} [allowDefault=false] An optional parameter that
     *        indicates that the default dom behavior is carried out. If this
     *        is set to true, preventDefault() will not be invoked.
     * @param {Boolean} [allowBubble=false] An optional parameter that
     *        indicates if the dom event should be bubbled up. If this is set
     *        to true, stopPropagation() will not be invoked.
     *
     * @return {Function} A handler that can be attached to a DOM event.
     */
    createDomEventHandler: function(handler, allowDefault, allowBubble) {
        if (typeof handler !== 'function') {
            throw new Error('Invalid handler specified (arg #1)');
        }
        return (e) => {
            if (!allowDefault) {
                e.preventDefault();
            }
            if (!allowBubble) {
                e.stopPropagation();
            }
            return handler(e);
        };
    }
};

export default eventUtils;
