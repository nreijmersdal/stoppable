(function() {
	"use strict";
  const DIST_DIR = "dist";
  const shell = require("shelljs");

  desc("Clean project");
  task('clean', function() {
    console.log("Cleaning project: .");
    shell.rm("-rf", DIST_DIR);
  }, { async: true});

  desc("Build distribution directory");
  task('build', [DIST_DIR], function() {
    console.log("Building distribution: .");
    shell.rm("-rf", DIST_DIR + "/*");
    shell.cp("-r", "src/content/*", DIST_DIR);
    shell.cp("-r", "src/manifest.json", DIST_DIR);
    jake.exec("node node_modules/browserify/bin/cmd.js src/javascript/stoppable.js -o " + DIST_DIR + "/stoppable.js", { interactive: true}, complete);
    jake.exec("node node_modules/browserify/bin/cmd.js src/javascript/options.js -o " + DIST_DIR + "/options.js", { interactive: true}, complete);
    jake.exec("node node_modules/browserify/bin/cmd.js src/javascript/popup.js -o " + DIST_DIR + "/popup.js", { interactive: true}, complete);
  }, { async: true});
  directory(DIST_DIR);

}());