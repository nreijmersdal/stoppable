// Karma configuration
// Generated on Tue Aug 08 2017 19:44:33 GMT+0200 (CEST)

module.exports = function karmaConfig(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'commonjs'],


    // list of files / patterns to load in the browser
    files: [
      'src/storage*.js',
      'src/stoplist*.js',
      'src/stopitem*.js',
      'src/status*.js',
      'src/time*.js',
      'src/dom*.js',
      'src/reason*.js',
      'test/unit/*.js',
      'test/vendor/chai-4.1.1.js',
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/storage*.js': ['commonjs', 'coverage'],
      'src/stoplist*.js': ['commonjs', 'coverage'],
      'src/stopitem*.js': ['commonjs', 'coverage'],
      'src/status*.js': ['commonjs', 'coverage'],
      'src/time*.js': ['commonjs', 'coverage'],
      'src/dom*.js': ['commonjs', 'coverage'],
      'src/reason*.js': ['commonjs', 'coverage'],
      'test/unit/*.js': ['commonjs'],
      'test/vendor/chai-4.1.1.js': ['commonjs'],
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'html',
      dir: 'coverage/',
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
  });
};
