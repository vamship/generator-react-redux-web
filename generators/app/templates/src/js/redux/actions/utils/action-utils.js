import { createAction } from 'redux-actions';

/**
 * Module that exposes action related utilities.
 */
export default {
    /**
     * Creates a redux set action with namespaces. This allows the generation of
     * actions with different names (ex: REQUEST_DATA) for different resources
     * without requiring redundant prefixes like USER_REQUEST_DATA.
     *
     * @param {Object} actionDefinition An object containing action information
     *        used to generate the action set.
     * @param {String} actionDefinition.namespace The namespace to associate with
     *        the actions.  This value is used as an internal prefix to ensure
     *        uniqueness, while the action type reference does not require it.
     * @param {Object|Array} actionDefinition.actions The action types to associate
     *        with the action set. This parameter can be either an array of strings,
     *        in which case an identity payload generator will be used to map
     *        actions (see redux-actions), or can be a map of action types, mapping
     *        to payload and meta generator functions.
     *
     * @return {Object} A map of actions generated using redux-actions, which means
     *         that the actions can be used with other redux-actions methods
     *         (ex: handleActions, etc).
     */
    createActionSet: (actionDefinition) => {
        if (!actionDefinition || (actionDefinition instanceof Array) ||
            typeof actionDefinition !== 'object') {
            throw new Error('Invalid action definition specified (arg #1)');
        }
        let {namespace, actions} = actionDefinition;
        if (typeof namespace !== 'string' || namespace.length <= 0) {
            throw new Error('Invalid action namespace specified (actionDefinition.namespace)');
        }
        if( (actions instanceof Array) ) {
            actions = actions.reduce((parent, prop) => {
                parent[prop] = {};
                return parent;
            }, {});
        } else if (!actions || typeof actions !== 'object') {
            throw new Error('Invalid action actions specified (actionDefinition.actions). Must be an array of strings, or a mapping of actions to generator functions.');
        }

        const actionSet = {};
        for (var typeName in actions) {
            const typeData = actions[typeName] || {};
            const namespacedType = `${namespace}__${typeName}`;
            actionSet[typeName] = createAction(namespacedType,
                typeData.payloadCreator,
                typeData.metaCreator);
        }
        return actionSet;
    }
};
