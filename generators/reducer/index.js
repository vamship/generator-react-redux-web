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
            reducer: this.options.reducer
        };
    }

   /**
    * Gather reducer information.
    */
    gatherReducerInfo() {
        const prompts = [{
            type: 'input',
            name: 'reducer',
            message: 'Reducer (ex: login)?',
            validate: (reducer) => {
                if(!reducer.match(/[a-zA-Z]+/)) {
                    return 'Reducer must be a valid string containing only uppercase and/or lowercase alphabets';
                }
                return true;
            },
            when: (answers) => !this.props.reducer
        }];

        return this.prompt(prompts).then((props) => {
            this.props = Object.assign(this.props || {}, props);
        });
    }

    /**
     * Generates target file names.
     */
    generateTargetFileNames() {
        const reducerFile = _decamelize(this.props.reducer);

        this.props.reducerFilePrefix = `${reducerFile.replace(/_/g, '-')}`;
    }

    /**
     * Announce the generator's actions.
     */
    announce() {
        this.log(`Generating reducer: ${this.props.reducer}`);
        this.log(_consts.SEPARATOR);
    }

    /**
     * Copy reducer file template to destination
     */
    copyReducerFile() {
        this.fs.copyTpl(
            this.templatePath('src/js/redux/reducers/reducer.js'),
            this.destinationPath(`src/js/redux/reducers/${this.props.reducerFilePrefix}-reducer.js`),
            this.props
        );
    }

    /**
     * Finish the rest of the main flow by composing sub generators.
     */
    compose() {
        this.composeWith(`${_consts.GENERATOR_NAME}:${_consts.SUB_GEN_REGEN_REDUCER_INDEX}`, {
            reducerList: [ this.props.reducerFilePrefix ],
            buildFromFs: true
        });
    }
};
