# ProBebe Movel

## Release

- Update version at config.xml and constants.js

- Build the app

`cordova build --release android`

- Sign the unsigned APK

` jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore [KEYSTORE_PATH] android-release-unsigned.apk ProBebe`

- Password: v1z12010

- Run zipalign tool

`[ANDREOID_SKD_PATH]/build-tools/22.0.1/zipalign -v 4 android-release-unsigned.apk probebe-release.apk`

