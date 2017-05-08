'use strict';

const Generator = require('yeoman-generator');

const _consts = require('../../utils/constants');

module.exports = class extends Generator {
    /**
     * Initializes the generator.
     */
    constructor(args, opts) {
        super(args, opts);
        this.props = {
            component: this.options.component
        };
    }

   /**
    * Gather component information.
    */
    gatherActionInfo() {
        const prompts = [{
            type: 'input',
            name: 'component',
            message: 'Redux component name (ex: login)',
            validate: (action) => {
                if(!action.match(/[a-zA-Z]+/)) {
                    return 'Component must be a valid string containing only uppercase and/or lowercase alphabets';
                }
                return true;
            },
            when: (answers) => !this.props.action
        }];

        return this.prompt(prompts).then((props) => {
            this.props = Object.assign(this.props || {}, props);
        });
    }

    /**
     * Announce the generator's actions.
     */
    announce() {
        this.log(`Generating redux components: ${this.props.component}`);
        this.log(_consts.SEPARATOR);
    }

    /**
     * Finish the rest of the main flow by composing sub generators.
     */
    compose() {
        this.composeWith(`${_consts.GENERATOR_NAME}:${_consts.SUB_GEN_ACTION}`, {
            action: this.props.component
        });
        this.composeWith(`${_consts.GENERATOR_NAME}:${_consts.SUB_GEN_REDUCER}`, {
            reducer: this.props.component
        });
        this.composeWith(`${_consts.GENERATOR_NAME}:${_consts.SUB_GEN_SAGA}`, {
            saga: this.props.component
        });
    }
};
