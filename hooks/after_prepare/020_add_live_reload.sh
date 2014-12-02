#!/bin/sh

MY_PATH="`dirname \"$0\"`"

if [ "$LIVE_RELOAD" = "true" ]
then
  ln -fs $(readlink -f $MY_PATH/../../platforms/android/assets/www/cordova.js) $(readlink -f $MY_PATH/../../www/cordova.js)
  ln -fs $(readlink -f $MY_PATH/../../platforms/android/assets/www/cordova_plugins.js) $(readlink -f $MY_PATH/../../www/cordova_plugins.js)
  ln -fs $(readlink -f $MY_PATH/../../platforms/android/assets/www/plugins/) $(readlink -f $MY_PATH/../../www/plugins/)
  gulp html
fi
