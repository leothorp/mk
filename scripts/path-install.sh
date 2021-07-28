#!/usr/bin/env bash

#1. replace the value of the 'platform' variable on line 5 below with either "macos" or "linux", depending on your machine.
#2. run this script in bash.

read -r -p "Enter desired installation platform. possible values are macos, linux, or win.exe." platform

curl -sSL https://raw.githubusercontent.com/leothorp/mk/main/dist/compressed/mk-$platform.zip -O \
&& unzip -j mk-$platform.zip dist/mk-$platform -d /usr/local/bin \
&& mv /usr/local/bin/mk-$platform /usr/local/bin/mk \
&& rm mk-$platform.zip && mk --version

# bash <(wget -qO- https://raw.githubusercontent.com/leothorp/mk/main/scripts/path-install.sh)