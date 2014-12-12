// Karma configuration
// Generated on Thu Dec 04 2014 14:15:33 GMT-0200 (BRST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon', 'sinon-chai'],


    // list of files / patterns to load in the browser
    files: [
      "www/lib/ionic/js/ionic.bundle.js",
      "www/lib/ngCordova/dist/ng-cordova.js",
      "www/lib/angular-mocks/angular-mocks.js",
      "www/lib/angular-resource/angular-resource.js",
      "www/cordova.js",
      "www/js/app.js",
      "www/js/constants.js",
      "www/js/controllers.js",
      "www/js/controllers/app_ctrl.js",
      "www/js/controllers/auth_ctrl.js",
      "www/js/controllers/messages_ctrl.js",
      "www/js/services.js",
      "www/js/storage_service.js",
      "www/js/services/authentication_service.js",
      "www/js/services/messages_service.js",
      "www/js/services/push_processing_service.js",
      "www/js/services/storage_service.js",
      "spec/**/*_spec.js"
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    plugins: [
      'karma-phantomjs-launcher',
      'karma-firefox-launcher',
      'karma-coverage',
      'karma-mocha',
      'karma-chai',
      'karma-sinon',
      'karma-sinon-chai'
    ]
  });

};
