#!/usr/bin/env node

if (process.env.LIVE_RELOAD == 'true') {
  var exec = require('child_process').exec;
  exec('gulp html');
}
