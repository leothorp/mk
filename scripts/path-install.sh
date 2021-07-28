#!/usr/bin/env bash

#installs mk under /usr/local/bin.

read -r -p "Enter desired installation platform. possible values are macos, linux, or win.exe.
" platform

curl -sSL https://raw.githubusercontent.com/leothorp/mk/main/dist/compressed/mk-$platform.zip -O \
&& unzip -j mk-$platform.zip dist/mk-$platform -d /usr/local/bin \
&& mv /usr/local/bin/mk-$platform /usr/local/bin/mk \
&& rm mk-$platform.zip && mk --version && echo "mk added to PATH."

#run from remote: bash <(curl -sSL https://raw.githubusercontent.com/leothorp/mk/main/scripts/path-install.sh)