'use strict';

const Generator = require('yeoman-generator');
const _consts = require('../../utils/constants');
const _recursiveReadDir = require('recursive-readdir');
const _camelcase = require('camelcase');

function _ignoreDir(file, stats) {
    return stats.isDirectory();
}

module.exports = class extends Generator {
    /**
     * Initializes the generator.
     */
    constructor(args, opts) {
        super(args, opts);
        this.props = {
            sagaList: this.options.sagaList,
            buildFromFs: !!this.options.buildFromFs,
            generatorName: _consts.GENERATOR_NAME
        };
    }

    /**
     * Build a list of sagas by inspecting the file system for saga
     * definitions.
     */
    buildSagaList() {
        if(this.props.sagaList && !this.props.buildFromFs) {
            // Sagas have already been populated via the options
            // property - typically happes when this generated is invoked
            // by another generator.
            return;
        }
        this.props.sagaList = this.props.sagaList || [];

        const done = this.async();
        const targetDir = this.destinationPath('src/js/redux/sagas/');
        _recursiveReadDir(targetDir, [_ignoreDir], (err, files) => {
            if(err) {
                this.env.error('Unable to build saga list');
                done();
                return;
            }
            const sagaList = files.map((file) => {
                const match = file.match(/src\/js\/redux\/sagas\/([a-zA-Z0-9-]*)-sagas.js/);
                if(match) {
                    return match[1];
                }
                return false;
            }).filter(saga => !!saga);
            this.props.sagaList = this.props.sagaList.concat(sagaList);
            done();
        });
    }

    /**
     * Convert the saga list into a set of tokens that can be used within
     * the templates.
     */
    generateTokens() {
        this.props.sagaList = this.props.sagaList.map((saga) => {
            return {
                definitionVar: `${_camelcase(saga)}Sagas`,
                fileName: `${saga}-sagas`
            };
        });
    }

    /**
     * Copy file list
     */
    copyFileList() {
        const file = 'src/js/redux/sagas/index.js';
        this.fs.copyTpl(
            this.templatePath(file),
            this.destinationPath(file),
            this.props
        );
    }
};
