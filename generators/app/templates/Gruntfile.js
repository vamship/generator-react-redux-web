/*eslint-env node*/
'use strict';

const _folder = require('wysknd-lib').folder;

module.exports = function(grunt) {
    /* ------------------------------------------------------------------------
     * Initialization of dependencies.
     * ---------------------------------------------------------------------- */
    //Time the grunt process, so that we can understand time consumed per task.
    require('time-grunt')(grunt);

    //Load all grunt tasks by reading package.json.
    require('load-grunt-tasks')(grunt);

    /* ------------------------------------------------------------------------
     * Build configuration parameters
     * ---------------------------------------------------------------------- */
    const packageConfig = grunt.file.readJSON('package.json') || {};

    const PRJ_FS = {
        appName: packageConfig.name || '__UNKNOWN__',
        appVersion: packageConfig.version || '__UNKNOWN__',
        tree: {                             /* ------------------------------ */
                                            /* <ROOT>                         */
            'src': {                        /*  |--- src                      */
                'css': null,                /*  |   |--- css                  */
                'js': null,                 /*  |   |--- js                   */
                'img': null                 /*  |   |--- img                  */
            },                              /*  |                             */
            'working': {                    /*  |--- working                  */
                'css': null,                /*  |   |--- css                  */
                'js': null,                 /*  |   |--- js                   */
                'img': null                 /*  |   |--- img                  */
            },                              /*  |                             */
            'dist': null                    /*  |--- dist                     */
        }                                   /* ------------------------------ */
    };

    PRJ_FS.ROOT = _folder.createFolderTree('./', PRJ_FS.tree);

    (function _createTreeRefs(parent, subTree) {
        for(let folder in subTree) {
            let folderName = folder.replace('.', '_');
            parent[folderName] = parent.getSubFolder(folder);

            let children = subTree[folder];
            if(typeof children === 'object') {
                _createTreeRefs(parent[folder], children);
            }
        }
    })(PRJ_FS.ROOT, PRJ_FS.tree);

    // Shorthand references to key folders.
    const ROOT = PRJ_FS.ROOT;
    const SRC = PRJ_FS.ROOT.src;
    const WORKING = PRJ_FS.ROOT.working;
    const DIST = PRJ_FS.ROOT.dist;

    /* ------------------------------------------------------------------------
     * Grunt task configuration
     * ---------------------------------------------------------------------- */
    grunt.initConfig({
        /**
         * Configuration for grunt-contrib-copy, which is used to:
         *  - Copy files to a distribution folder during build.
         */
        copy: {
            compile: {
                files: [ {
                    expand: true,
                    cwd: SRC.getPath(),
                    src: [
                        '**',
                        '!js/**'
                    ],
                    dest: WORKING.getPath()
                } ]
            }
        },

        /**
         * Configuration for grunt-contrib-clean, which is used to:
         *  - Remove temporary files and folders.
         */
        clean: {
            dist: [ DIST.getPath() ],
            working: [ WORKING.getPath() ]
        },

        /**
         * Configuration for grunt-eslint, which is used to:
         *  - Lint source and test files.
         */
        eslint: {
            dev: [ SRC.js.allFilesPattern('js') ]
        },

        /**
         * Configuration for grunt-esformatter, which is used to:
         *  - Format javascript source code
         */
        esformatter: {
            src: [ SRC.js.allFilesPattern('js') ]
        },

        /**
         * Configuration for grunt-browserify, which is used to:
         *  - Combine all CommonJS modules for the browser into a single
         *    javascript file.
         */
        browserify: {
            compile: {
                options: {
                    transform: [ [
                        'babelify', {
                            presets: [ 'env', 'react' ],
                            plugins: [ 'transform-object-rest-spread' ]
                        }
                    ], [
                        'browserify-postcss', {
                            map: false,
                            plugin: [
                                'postcss-import',
                                'postcss-custom-media',
                                'postcss-css-variables',
                                'postcss-inline-svg',
                                [ 'autoprefixer', {
                                    browsers: ['last 2 versions'],
                                    zindex: false
                                } ],
                                'postcss-calc',
                                ['postcss-pxtorem', {
                                    propWhiteList: [
                                        'font', 'font-size', 'line-height',
                                        'letter-spacing', 'width', 'height',
                                        'padding', 'margin'
                                    ],
                                    mediaQuery: true,
                                }],
                                ['cssnano', {
                                    zindex: false
                                }]
                            ],
                            inject: true
                        }
                    ] ]
                },
                src: SRC.js.getChildPath('app.js'),
                dest: WORKING.js.getChildPath('app.js')
            }
        },

        /**
         * Configuration for grunt-contrib-uglify, which is used to:
         *  - Minify javascript files for production deployments.
         */
        uglify: {
            options: {
            },
            default: {
                files: [{
                    cwd: ROOT.getPath(),
                    src: WORKING.js.getChildPath('app.js'),
                    dest: WORKING.js.getChildPath('app.js')
                }]
            }
        },

        /**
         * Configuration for grunt-contrib-watch, which is used to:
         *  - Monitor all source/test files and trigger actions when these
         *    files change.
         */
        watch: {
            allSources: {
                files: [ SRC.allFilesPattern() ],
                tasks: [ ]
            }
        }
    });

    /* ------------------------------------------------------------------------
     * Task registrations
     * ---------------------------------------------------------------------- */
    /**
     * Default task. Performs default tasks prior to commit/push, including:
     *  - Building sources
     */
    grunt.registerTask('default', [ 'build' ]);

    /**
     * Default task. Performs default tasks prior to commit/push, including:
     *  - Building sources
     */
    grunt.registerTask('build', [ 'clean',
                                    'eslint:dev',
                                    'copy:compile',
                                    'browserify:compile',
                                    'uglify:default' ]);

    /**
     * Monitor task - track changes on different sources, and triggers a rebuild
     * of sources if any changes are detected.
     */
    grunt.registerTask('monitor',
        'Monitors source files for changes, and performs actions as necessary',
        function() {
            const tasks = [];

            for (let index = 0; index < arguments.length; index++) {
                let arg = arguments[index];

                switch(arg) {
                    case 'lint':
                        tasks.push('eslint:dev');
                        break;
                    case 'build':
                        tasks.push('build');
                        break;
                }
            }

            grunt.log.writeln('Tasks to run on change: [' + tasks + ']');
            if(tasks.length > 0) {
                grunt.config.set('watch.allSources.tasks', tasks);
                grunt.task.run('watch:allSources');
            } else {
                grunt.log.error('No tasks specified to execute on change');
            }
        }
    );

    /**
     * Lint task - checks source and test files for linting errors.
     */
    grunt.registerTask('lint', [ 'eslint:dev' ]);

    /**
     * Formatter task - formats all source and test files.
     */
    grunt.registerTask('format', [ 'esformatter' ]);

};
