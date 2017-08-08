/* global jake, complete, desc, task, directory */
/* eslint-disable no-console, import/no-extraneous-dependencies */
(function jakefile() {
  const DIST_DIR = 'dist';
  const shell = require('shelljs');

  desc('Start karma (run this first)');
  task('karma', () => {
    console.log('Testing project: .');
    jake.exec('node node_modules/karma/bin/karma start', { interactive: true }, complete);
  }, { async: true });

  desc('Lint project');
  task('lint', () => {
    console.log('Linting project: .');
    jake.exec('node node_modules/eslint/bin/eslint.js src/javascript/**/*.js', { interactive: true }, complete);
    jake.exec('node node_modules/eslint/bin/eslint.js jakefile.js', { interactive: true }, complete);
  }, { async: true });

  desc('Run mocha tests in karma');
  task('test', () => {
    console.log('Testing project: .');
    jake.exec('node node_modules/karma/bin/karma run', { interactive: true }, complete);
  }, { async: true });

  desc('Clean project');
  task('clean', () => {
    console.log('Cleaning project: .');
    shell.rm('-rf', DIST_DIR);
  }, { async: true });

  desc('Build distribution directory');
  task('build', ['lint', 'test', DIST_DIR], () => {
    console.log('Building distribution: .');
    shell.rm('-rf', `${DIST_DIR}/*`);
    shell.cp('-r', 'src/content/*', DIST_DIR);
    shell.cp('-r', 'src/manifest.json', DIST_DIR);
    jake.exec(`node node_modules/browserify/bin/cmd.js src/javascript/stoppable.js -o ${DIST_DIR}/stoppable.js`, { interactive: true }, complete);
    jake.exec(`node node_modules/browserify/bin/cmd.js src/javascript/options.js -o ${DIST_DIR}/options.js`, { interactive: true }, complete);
    jake.exec(`node node_modules/browserify/bin/cmd.js src/javascript/popup.js -o ${DIST_DIR}/popup.js`, { interactive: true }, complete);
  }, { async: true });
  directory(DIST_DIR);
}());
