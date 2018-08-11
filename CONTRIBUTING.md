# Contributing

We love pull requests from everyone, but features should help people motivate to stop or make the usage easier. We certainly do not just want to make websites impossible to visit, other tools already deliver such functionality.

Fork, then clone the repo.

Set up your machine:

    First install a recent version of Node.js
    npm install

Make sure the tests pass:

    npm start build
    npm start integration

Make your change. Manual test your change:

    Enable developer mode under chrome://extensions/
    Load unpacked extention... and point to the dist/ directory
    Make sure you click Reload if you made changes after your first load

Add tests for your change. Make the tests pass:

    npm start build
    npm start integration

Push to your fork and submit a pull request.

Some things that will increase the chance that your pull request is accepted:

* Write tests.
* Follow our linting rules and general style.
* Write a good commit message.