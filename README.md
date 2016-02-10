# ProBebe Movel

## Release
- Install cordova crosswalk

ionic browser add crosswalk

- Update version at config.xml and constants.js

- Build the app

`cordova build --release android`

- Sign the unsigned APK

` jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore [KEYSTORE_PATH] android-release-unsigned.apk ProBebe`

- for 2 apks:
- android-x86-release-unsigned.apk
- android-armv7-release-unsigned.apk

- Password: v1z12010

- Run zipalign tool for 2 apks too:

`[ANDREOID_SKD_PATH]/build-tools/22.0.1/zipalign -v 4 android-release-unsigned.apk probebe-release.apk`

