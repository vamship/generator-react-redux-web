'use strict';

const Generator = require('yeoman-generator');
const _decamelize = require('decamelize');

const _consts = require('../../utils/constants');

module.exports = class extends Generator {
    /**
     * Initializes the generator.
     */
    constructor(args, opts) {
        super(args, opts);
        this.props = {
            action: this.options.action
        };
    }

   /**
    * Gather action information.
    */
    gatherActionInfo() {
        const prompts = [{
            type: 'input',
            name: 'action',
            message: 'Action (ex: login)?',
            validate: (action) => {
                if(!action.match(/[a-zA-Z]+/)) {
                    return 'Action must be a valid string containing only uppercase and/or lowercase alphabets';
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
     * Generates target file names.
     */
    generateTargetFileNames() {
        const actionFile = _decamelize(this.props.action);

        this.props.actionFilePrefix = `${actionFile.replace(/_/g, '-')}`;
        this.props.actionNamespace = actionFile.toUpperCase();
    }

    /**
     * Announce the generator's actions.
     */
    announce() {
        this.log(`Generating action: ${this.props.action}`);
        this.log(_consts.SEPARATOR);
    }

    /**
     * Copy action file template to destination
     */
    copyActionFile() {
        this.fs.copyTpl(
            this.templatePath('src/js/redux/actions/actions.js'),
            this.destinationPath(`src/js/redux/actions/${this.props.actionFilePrefix}-actions.js`),
            this.props
        );
    }

    /**
     * Finish the rest of the main flow by composing sub generators.
     */
    compose() {
        this.composeWith(`${_consts.GENERATOR_NAME}:${_consts.SUB_GEN_REGEN_ACTION_INDEX}`, {
            actionList: [ this.props.actionFilePrefix ],
            buildFromFs: true
        });
    }
};
