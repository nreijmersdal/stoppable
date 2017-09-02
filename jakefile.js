/* global jake, complete, desc, task, directory */
/* eslint-disable no-console, import/no-extraneous-dependencies */
(function jakefile() {
  const DIST_DIR = 'dist';
  directory(DIST_DIR);

  desc('Start Karma (start this before test/build tasks)');
  task('karma', () => {
    console.log('Staring karma service: .');
    jake.exec('node node_modules/karma/bin/karma start', { interactive: true }, complete);
  }, { async: true });

  desc('Lint project');
  task('lint', () => {
    console.log('Linting project: .');
    const files = [
      'src/javascript/**/*.js',
      'src/seleniumTests/**/*.js',
      'jakefile.js',
    ];
    jake.exec(`node node_modules/eslint/bin/eslint.js ${files.join(' ')}`, { interactive: true }, complete);
  }, { async: true });

  desc('Run Mocha tests in Karma');
  task('test', () => {
    console.log('Unit testing project: .');
    jake.exec('node node_modules/karma/bin/karma run', { interactive: true }, complete);
  }, { async: true });

  desc('Run integration tests with Selenium');
  task('integration', () => {
    console.log('Integration testing project: .');
    jake.exec('node node_modules/mocha/bin/mocha src/seleniumTests/*.js', { interactive: true }, complete);
  }, { async: true });

  desc('Clean project');
  task('clean', () => {
    console.log('Cleaning project: .');
    jake.rmRf(DIST_DIR);
  });

  desc('Build distribution directory');
  task('build', ['lint', 'test', DIST_DIR], () => {
    console.log('Building distribution: .');
    const shell = require('shelljs');
    shell.rm('-rf', `${DIST_DIR}/*`);
    shell.cp('-r', 'src/content/*', DIST_DIR);
    shell.cp('-r', 'src/manifest.json', DIST_DIR);
    const cmds = [
      `node node_modules/browserify/bin/cmd.js src/javascript/stoppable.js -o ${DIST_DIR}/stoppable.js`,
      `node node_modules/browserify/bin/cmd.js src/javascript/options.js -o ${DIST_DIR}/options.js`,
      `node node_modules/browserify/bin/cmd.js src/javascript/popup.js -o ${DIST_DIR}/popup.js`,
    ];
    jake.exec(cmds, { interactive: true }, complete);
  }, { async: true });
}());
