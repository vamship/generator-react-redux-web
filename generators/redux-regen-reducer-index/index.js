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
            reducerList: this.options.reducerList,
            buildFromFs: !!this.options.buildFromFs,
            generatorName: _consts.GENERATOR_NAME
        };
    }

    /**
     * Build a list of reducers by inspecting the file system for reducer
     * definitions.
     */
    buildReducerList() {
        if(this.props.reducerList && !this.props.buildFromFs) {
            // Reducers have already been populated via the options
            // property - typically happes when this generated is invoked
            // by another generator.
            return;
        }
        this.props.reducerList = this.props.reducerList || [];

        const done = this.async();
        const targetDir = this.destinationPath('src/js/redux/reducers/');
        _recursiveReadDir(targetDir, [_ignoreDir], (err, files) => {
            if(err) {
                this.env.error('Unable to build reducer list');
                done();
                return;
            }
            const reducerList = files.map((file) => {
                const match = file.match(/src\/js\/redux\/reducers\/([a-zA-Z0-9-]*)-reducer.js/);
                if(match) {
                    return match[1];
                }
                return false;
            }).filter(reducer => !!reducer);
            this.props.reducerList = this.props.reducerList.concat(reducerList);
            done();
        });
    }

    /**
     * Convert the reducer list into a set of tokens that can be used within
     * the templates.
     */
    generateTokens() {
        this.props.reducerList = this.props.reducerList.map((reducer) => {
            return {
                definitionVar: `${_camelcase(reducer)}Reducer`,
                reducerVar: `${_camelcase(reducer)}`,
                fileName: `${reducer}-reducer`
            };
        });
    }

    /**
     * Copy file list
     */
    copyFileList() {
        const file = 'src/js/redux/reducers/index.js';
        this.fs.copyTpl(
            this.templatePath(file),
            this.destinationPath(file),
            this.props
        );
    }
};
