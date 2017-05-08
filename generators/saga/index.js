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
            saga: this.options.saga
        };
    }

   /**
    * Gather saga information.
    */
    gatherSagaInfo() {
        const prompts = [{
            type: 'input',
            name: 'saga',
            message: 'Saga (ex: login)?',
            validate: (saga) => {
                if(!saga.match(/[a-zA-Z]+/)) {
                    return 'Saga must be a valid string containing only uppercase and/or lowercase alphabets';
                }
                return true;
            },
            when: (answers) => !this.props.saga
        }];

        return this.prompt(prompts).then((props) => {
            this.props = Object.assign(this.props || {}, props);
        });
    }

    /**
     * Generates target file names.
     */
    generateTargetFileNames() {
        const sagaFile = _decamelize(this.props.saga);

        this.props.sagaFilePrefix = `${sagaFile.replace(/_/g, '-')}`;
    }

    /**
     * Announce the generator's actions.
     */
    announce() {
        this.log(`Generating saga: ${this.props.saga}`);
        this.log(_consts.SEPARATOR);
    }

    /**
     * Copy saga file template to destination
     */
    copySagaFile() {
        this.fs.copyTpl(
            this.templatePath('src/js/redux/sagas/sagas.js'),
            this.destinationPath(`src/js/redux/sagas/${this.props.sagaFilePrefix}-sagas.js`),
            this.props
        );
    }

    /**
     * Finish the rest of the main flow by composing sub generators.
     */
    compose() {
        this.composeWith(`${_consts.GENERATOR_NAME}:${_consts.SUB_GEN_REGEN_SAGA_INDEX}`, {
            sagaList: [ this.props.sagaFilePrefix ],
            buildFromFs: true
        });
    }
};
