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
            containerName: this.options.containerName
        };
    }

   /**
    * Gather container information.
    */
    gatherContainerInfo() {
        const prompts = [{
            type: 'input',
            name: 'containerName',
            message: 'Container Name (ex: login)?',
            validate: (container) => {
                if(!container.match(/[a-zA-Z0-9-]+/)) {
                    return 'Container must be a valid string containing letters, numbers and/or -';
                }
                return true;
            },
            when: (answers) => !this.props.containerName
        }];

        return this.prompt(prompts).then((props) => {
            this.props = Object.assign(this.props || {}, props);
        });
    }

    /**
     * Generates target file names.
     */
    generateTargetFileNames() {
        const containerFile = _decamelize(this.props.containerName);

        this.props.containerFilePrefix = `${containerFile.replace(/_/g, '-')}`;
        this.props.componentClass = `${_pascalcase(this.props.containerName)}Component`;
        this.props.containerClass = `${_pascalcase(this.props.containerName)}Container`;
    }

    /**
     * Announce the generator's actions.
     */
    announce() {
        this.log(`Generating container: ${this.props.containerName}`);
        this.log(_consts.SEPARATOR);
    }

    /**
     * Copy container file template to destination
     */
    copyContainerFile() {
        this.fs.copyTpl(
            this.templatePath('src/js/containers/container.js'),
            this.destinationPath(`src/js/containers/${this.props.containerFilePrefix}-container.js`),
            this.props
        );
    }
};
