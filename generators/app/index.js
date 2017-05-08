'use strict';

const Generator = require('yeoman-generator');
const _chalk = require('chalk');
const _yosay = require('yosay');
const _recursiveReadDir = require('recursive-readdir');

const _consts = require('../../utils/constants');
const _package = require('../../package.json');

module.exports = class extends Generator {
    /**
     * Initializes the generator.
     */
    constructor(args, opts) {
        super(args, opts);
        this.fileList = [];
        this.actionList = [];
        this.sagaList = [];
        this.reducerList = [];
    }

   /**
    * Gather basic project information.
    */
    gatherProjectInfo() {
        const generatorTitle = `${_consts.GENERATOR_NAME} v${_package.version}`;
        this.log(_yosay(
            `React/Redux SPA Generator.\n${_chalk.red(generatorTitle)} `
        ));

        const prompts = [{
            type: 'input',
            name: 'projectName',
            message: 'Project name?',
            default: answers => this.appname.replace(/\s/g, '-')
        }, {
            type: 'input',
            name: 'projectDescription',
            message: 'Project description?',
            default: 'My react website'
        }, {
            type: 'input',
            name: 'websiteTitle',
            message: 'Website title?',
            default: answers => answers.projectName.replace(/-/g, ' ')
        }, {
            type: 'input',
            name: 'websiteDescription',
            message: 'Website description?',
            default: answers => answers.websiteTitle
        }, {
            type: 'input',
            name: 'authorName',
            message: 'Author name?',
            default: '__NA__'
        }, {
            type: 'input',
            name: 'authorEmail',
            message: 'Author email?',
            default: '__NA__'
        }, {
            type: 'input',
            name: 'githubUsername',
            message: 'Github username?',
            default: '__NA__'
        }];

        return this.prompt(prompts).then((props) => {
            this.props = Object.assign(this.props || {}, props);
        });
    }

    /**
     * Build file list
     */
    buildFileList() {
        const done = this.async();
        const sourceRoot = this.sourceRoot() + '/';
        _recursiveReadDir(sourceRoot, (err, files) => {
            if(err) {
                this.env.error('Unable to build file list for project');
                done();
                return;
            }
            this.fileList = files.map((file) => {
                return file.replace(sourceRoot, '');
            });

            //Build action list
            this.actionList = files.map((file) => {
                const match = file.match(/src\/js\/redux\/actions\/([a-zA-Z0-9-]*)-actions.js/);
                if(match) {
                    return match[1];
                }
                return false;
            }).filter(item => !!item);

            //Build reducer list
            this.reducerList = files.map((file) => {
                const match = file.match(/src\/js\/redux\/reducers\/([a-zA-Z0-9-]*)-reducer.js/);
                if(match) {
                    return match[1];
                }
                return false;
            }).filter(item => !!item);

            //Build saga list
            this.sagaList = files.map((file) => {
                const match = file.match(/src\/js\/redux\/sagas\/([a-zA-Z0-9-]*)-sagas.js/);
                if(match) {
                    return match[1];
                }
                return false;
            }).filter(item => !!item);

            done();
        });
    }

    /**
     * Announce the generator's actions.
     */
    announce() {
        this.log(`Generating react web app: ${this.props.websiteTitle}`);
        this.log(_consts.SEPARATOR);
    }

    /**
     * Copy file list
     */
    copyFileList() {
        this.fileList.forEach((srcFile) => {
            const tokens = srcFile.split('/');
            const fileName = tokens[tokens.length - 1];
            tokens[tokens.length - 1]  = (fileName.indexOf('_') === 0)?
                                           fileName.replace('_', '.'): fileName;
            const destFile = tokens.join('/');
            this.fs.copyTpl(
                this.templatePath(srcFile),
                this.destinationPath(destFile),
                this.props
            );
        });
    }

    /**
     * Finish the rest of the main flow by composing sub generators.
     */
    compose() {
        this.composeWith(`${_consts.GENERATOR_NAME}:${_consts.SUB_GEN_REGEN_ACTION_INDEX}`, {
            actionList: this.actionList
        });
        this.composeWith(`${_consts.GENERATOR_NAME}:${_consts.SUB_GEN_REGEN_REDUCER_INDEX}`, {
            reducerList: this.reducerList
        });
        this.composeWith(`${_consts.GENERATOR_NAME}:${_consts.SUB_GEN_REGEN_SAGA_INDEX}`, {
            sagaList: this.sagaList
        });
    }
};
