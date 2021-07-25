#!/usr/bin/env bash

#1. replace "PLATFORM" below with either "macos", "linux", or "win.exe" depending on your machine.
#2. run that updated script in bash. on mac and linux at least, 'mk' should now be in your PATH globally.
platform="PLATFORM" && curl -sSL https://raw.githubusercontent.com/leothorp/mk/main/dist/compressed/mk-$platform.zip -O \
&& unzip -j mk-$platform.zip dist/mk-$platform -d /usr/local/bin \
&& mv /usr/local/bin/mk-$platform /usr/local/bin/mk \
&& rm mk-$platform.zip && mk --version;