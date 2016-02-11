#!/usr/bin/env node

// each object in the array consists of a key which refers to the source and
// the value which is the destination.
var filestocopy = [{
      "resources/android/icon/push-logo.png":
      "platforms/android/res/drawable/push-logo.png"
    },
    {
      "resources/android/icon/push-logo.png":
      "platforms/android/res/drawable-hdpi/push-logo.png"
    },
    {
      "resources/android/icon/push-logo.png":
      "platforms/android/res/drawable-land-hdpi/push-logo.png"
    },
    {
      "resources/android/icon/push-logo.png":
      "platforms/android/res/drawable-land-ldpi/push-logo.png"
    },
    {
      "resources/android/icon/push-logo.png":
      "platforms/android/res/drawable-land-mdpi/push-logo.png"
    },
    {
      "resources/android/icon/push-logo.png":
      "platforms/android/res/drawable-land-xhdpi/push-logo.png"
    },
    {
      "resources/android/icon/push-logo.png":
      "platforms/android/res/drawable-land-xxhdpi/push-logo.png"
    },
    {
      "resources/android/icon/push-logo.png":
      "platforms/android/res/drawable-land-xxxhdpi/push-logo.png"
    },
    {
      "resources/android/icon/push-logo.png":
      "platforms/android/res/drawable-ldpi/push-logo.png"
    },
    {
      "resources/android/icon/push-logo.png":
      "platforms/android/res/drawable-mdpi/push-logo.png"
    },
    {
      "resources/android/icon/push-logo.png":
      "platforms/android/res/drawable-port-hdpi/push-logo.png"
    },
    {
      "resources/android/icon/push-logo.png":
      "platforms/android/res/drawable-port-ldpi/push-logo.png"
    },
    {
      "resources/android/icon/push-logo.png":
      "platforms/android/res/drawable-port-mdpi/push-logo.png"
    },
    {
      "resources/android/icon/push-logo.png":
      "platforms/android/res/drawable-port-xhdpi/push-logo.png"
    },
    {
      "resources/android/icon/push-logo.png":
      "platforms/android/res/drawable-port-xxhdpi/push-logo.png"
    },
    {
      "resources/android/icon/push-logo.png":
      "platforms/android/res/drawable-port-xxxhdpi/push-logo.png"
    },
    {
      "resources/android/icon/push-logo.png":
      "platforms/android/res/drawable-xhdpi/push-logo.png"
    },
    {
      "resources/android/icon/push-logo.png":
      "platforms/android/res/drawable-xxhdpi/push-logo.png"
    },
    {
      "resources/android/icon/push-logo.png":
      "platforms/android/res/drawable-xxxhdpi/push-logo.png"
    },
    {
      "resources/android/sounds/baby-laughing-01.mp3":
      "platforms/android/res/raw/baby-laughing-01.mp3"}
  ];

var fs = require('fs');
var path = require('path');

// no need to configure below
var rootdir = process.argv[2];

filestocopy.forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
        var val = obj[key];
        var srcfile = path.join(rootdir, key);
        var destfile = path.join(rootdir, val);
        //console.log("copying "+srcfile+" to "+destfile);
        var destdir = path.dirname(destfile);
        if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
            fs.createReadStream(srcfile).pipe(
               fs.createWriteStream(destfile));
        }
    });
});
