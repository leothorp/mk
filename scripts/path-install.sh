#!/usr/bin/env bash

echo https://raw.githubusercontent.com/leothorp/mk/main/dist/compressed/mk-$1.zip
curl -sSL https://raw.githubusercontent.com/leothorp/mk/main/dist/compressed/mk-$1.zip -O \
&& unzip mk-$1.zip -d /usr/local/bin \
&& mv /usr/local/bin mk-$1 /usr/local/bin/mk \
&& rm mk-$1.zip && mk --version;



# curl -sSL https://raw.githubusercontent.com/leothorp/mk/main/scripts/path-install.sh | bash 


# curl https://raw.githubusercontent.com/leothorp/mk/main/scripts/path-install.sh -0 && bash path-install.sh macos && rm path-install.sh;

 #macos, linux, win.exe
