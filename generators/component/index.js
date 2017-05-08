'use strict';

const Generator = require('yeoman-generator');
const _decamelize = require('decamelize');
const _pascalcase = require('pascalcase');

const _consts = require('../../utils/constants');

module.exports = class extends Generator {
    /**
     * Initializes the generator.
     */
    constructor(args, opts) {
        super(args, opts);
        this.props = {
            componentName: this.options.componentName
        };
    }

   /**
    * Gather component information.
    */
    gatherComponentInfo() {
        const prompts = [{
            type: 'input',
            name: 'componentName',
            message: 'Component Name (ex: login)?',
            validate: (component) => {
                if(!component.match(/[a-zA-Z0-9-]+/)) {
                    return 'Component must be a valid string containing letters, numbers and/or -';
                }
                return true;
            },
            when: (answers) => !this.props.componentName
        }, {
            type: 'confirm',
            name: 'createContainer',
            message: 'Generate container for the component?',
            default: true
        }];

        return this.prompt(prompts).then((props) => {
            this.props = Object.assign(this.props || {}, props);
        });
    }

    /**
     * Generates target file names.
     */
    generateTargetFileNames() {
        const componentFile = _decamelize(this.props.componentName);

        this.props.componentFilePrefix = `${componentFile.replace(/_/g, '-')}`;
        this.props.componentClass = `${_pascalcase(this.props.componentName)}Component`;
    }

    /**
     * Announce the generator's actions.
     */
    announce() {
        this.log(`Generating component: ${this.props.componentName}`);
        this.log(_consts.SEPARATOR);
    }

    /**
     * Copy component file template to destination
     */
    copyComponentFile() {
        this.fs.copyTpl(
            this.templatePath('src/js/components/component.js'),
            this.destinationPath(`src/js/components/${this.props.componentFilePrefix}-component.js`),
            this.props
        );
    }

    /**
     * Generate the container if necessary
     */
    compose() {
        if(this.props.createContainer) {
            this.composeWith(`${_consts.GENERATOR_NAME}:${_consts.SUB_GEN_CONTAINER}`, {
                containerName: this.props.componentName
            });
        }
    }
};
