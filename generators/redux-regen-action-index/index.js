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
            actionList: this.options.actionList,
            buildFromFs: !!this.options.buildFromFs,
            generatorName: _consts.GENERATOR_NAME
        };
    }

    /**
     * Build a list of actions by inspecting the file system for action
     * definitions.
     */
    buildActionList() {
        if(this.props.actionList && !this.props.buildFromFs) {
            // Actions have already been populated via the options
            // property - typically happes when this generated is invoked
            // by another generator.
            return;
        }
        this.props.actionList = this.props.actionList || [];

        const done = this.async();
        const targetDir = this.destinationPath('src/js/redux/actions/');
        _recursiveReadDir(targetDir, [_ignoreDir], (err, files) => {
            if(err) {
                this.env.error('Unable to build action list');
                done();
                return;
            }
            const actionList = files.map((file) => {
                const match = file.match(/src\/js\/redux\/actions\/([a-zA-Z0-9-]*)-actions.js/);
                if(match) {
                    return match[1];
                }
                return false;
            }).filter(action => !!action);
            this.props.actionList = this.props.actionList.concat(actionList);
            done();
        });
    }

    /**
     * Convert the action list into a set of tokens that can be used within
     * the templates.
     */
    generateTokens() {
        this.props.actionList = this.props.actionList.map((action) => {
            return {
                definitionVar: `${_camelcase(action)}ActionDefinition`,
                actionsVar: `${_camelcase(action)}Actions`,
                fileName: `${action}-actions`
            };
        });
    }

    /**
     * Copy file list
     */
    copyFileList() {
        const file = 'src/js/redux/actions/index.js';
        this.fs.copyTpl(
            this.templatePath(file),
            this.destinationPath(file),
            this.props
        );
    }
};
