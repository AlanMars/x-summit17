# Quick Start Guide

## Installing

### Pre-requisites

- [Node.js](https://nodejs.org/en/), required

  > Latest LTS Version: v6.11.3 (includes npm 3.10.10)<br>
  > Latest Current Version: v8.4.0 (includes npm 5.3.0)

- Heroku CLI, required

  - MacOS, download and run the [MacOS installer](https://cli-assets.heroku.com/heroku-cli/channels/stable/heroku-cli.pkg).
  - Windows, download and run the Windows installer [32-bit](https://cli-assets.heroku.com/heroku-cli/channels/stable/heroku-cli-x86.exe) [64-bit](https://cli-assets.heroku.com/heroku-cli/channels/stable/heroku-cli-x64.exe)

- [Git](https://git-scm.com), if you need.

### Verify your installation

```bash

$ node --version
v8.4.0

$ npm --version
5.3.0

$ heroku --version
heroku-cli/6.14.20-737bba7 (darwin-x64) node-v8.4.0

$ git --version
git version 2.14.1
```

## Getting started

```bash

# Make workspace
$ mkdir adsk-x-summit2017
$ cd adsk-x-summit2017/

# Clone or download
$ git clone https://github.com/AlanMars/x-summit17.git
$ cd x-summit17

# Intall packages dependencies, takes about 16 secs
$ npm install
# Start a package
$ npm start
```

Your app should now be running on <http://localhost:3000>

## Deploying to Heroku

### Login

Once installed, you can use the heroku command from your command shell. Log in using the email address and password:

```bash
$ heroku login
Enter your Heroku credentials:
Email: x-summit-17@autodesk.com
Password: ***********

Logged in as x-summit-17@autodesk.com
```

### Add git remote heroku

For your existing repositories, simply set the **heroku** remote to <https://git.heroku.com/x-summit-table-{your> table number}.git

```bash
$ heroku git:remote -a x-summit-table-500

set git remote heroku to https://git.heroku.com/x-summit-table-500.git
```

### Deploy your application

Make some changes to the code you just cloned. Please change the Container ID (GTM-xxxxxxx) in measures.ejs. After that you can commit your code to the repository and deploy it to Heroku using Git.

```bash
$ git add .
$ git commit -am "Updated Google Tag Manager Container ID - GTM-xxxxxxx in measures.ejs file"

$ git push heroku master

Counting objects: 1, done.
Writing objects: 100% (1/1), 281 bytes | 281.00 KiB/s, done.
Total 1 (delta 0), reused 1 (delta 0)
remote: Compressing source files... done.
remote: Building source:
remote:
remote: -----> Node.js app detected
remote:
remote: -----> Creating runtime environment
remote:
remote:        NPM_CONFIG_LOGLEVEL=error
remote:        NPM_CONFIG_PRODUCTION=true
remote:        NODE_VERBOSE=false
remote:        NODE_ENV=production
remote:        NODE_MODULES_CACHE=true
remote:
remote: -----> Installing binaries
remote:        engines.node (package.json):  6.11.1
remote:        engines.npm (package.json):   unspecified (use default)
remote:
remote:        Resolving node version 6.11.1...
remote:        Downloading and installing node 6.11.1...
remote:        Detected package-lock.json: defaulting npm to version 5.x.x
remote:        Bootstrapping npm 5.x.x (replacing 3.10.10)...
remote:        npm 5.4.2 installed
remote:
remote: -----> Restoring cache
remote:        Skipping cache restore (not-found)
remote:
remote: -----> Building dependencies
remote:        Installing node modules (package.json + package-lock)
remote:        added 45 packages in 3.047s
remote:
remote: -----> Caching build
remote:        Clearing previous node cache
remote:        Saving 2 cacheDirectories (default):
remote:        - node_modules
remote:        - bower_components (nothing to cache)
remote:
remote: -----> Build succeeded!
remote: -----> Discovering process types
remote:        Procfile declares types -> web
remote:
remote: -----> Compressing...
remote:        Done: 16.5M
remote: -----> Launching...
remote:        Released v3
remote:        https://x-summit-sample.herokuapp.com/ deployed to Heroku
remote:
remote: Verifying deploy... done.
To https://git.heroku.com/x-summit-sample.git
 * [new branch]      master -> master
```

### List dynos and scale dyno quantity up or down

```bash
 $ heroku ps
 Free dyno hours quota remaining this month: 550h 0m (100%)
 For more information on dyno sleeping and how to upgrade, see:
 https://devcenter.heroku.com/articles/dyno-sleeping

 === web (Free): node index.js (1)
 web.1: up 2017/09/16 22:57:39 +0800 (~ 7m ago)
```

```bash
$ heroku ps:scale web=1
Scaling dynos... done, now running web at 1:Free
```

### Open the app in a web browser

```bash
$ heroku open
```

## Recommended Editor

- [ATOM](https://atom.io/), A hackable text editor for the 21st Century.

  - Open Settings → Install and search for [file-icons](https://atom.io/packages/file-icons)

- [WebStorm](https://www.jetbrains.com/webstorm/), The smartest JavaScript IDE.

- [Sublime Text 3](https://www.sublimetext.com/)
