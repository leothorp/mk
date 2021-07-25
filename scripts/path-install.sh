#!/usr/bin/env bash
platform="macos"
echo https://raw.githubusercontent.com/leothorp/mk/main/dist/compressed/mk-$platform.zip
curl -sSL https://raw.githubusercontent.com/leothorp/mk/main/dist/compressed/mk-$platform.zip -O \
&& unzip mk-$platform.zip -d /usr/local/bin \
&& mv /usr/local/bin mk-$platform /usr/local/bin/mk \
&& rm mk-$platform.zip && mk --version;



# curl -sSL https://raw.githubusercontent.com/leothorp/mk/main/scripts/path-install.sh | bash 


# curl https://raw.githubusercontent.com/leothorp/mk/main/scripts/path-install.sh -0 && bash path-install.sh macos && rm path-install.sh;

 #macos, linux, win.exe
