#!/usr/bin/env bash
echo "$0 $1 $2"
echo https://raw.githubusercontent.com/leothorp/mk/main/dist/compressed/mk-$0.zip
curl -sSL https://raw.githubusercontent.com/leothorp/mk/main/dist/compressed/mk-$0.zip -O \
&& unzip mk-$0.zip -d /usr/local/bin \
&& mv /usr/local/bin mk-$0 /usr/local/bin/mk \
&& rm mk-$0.zip && mk --version;



# curl -sSL https://raw.githubusercontent.com/leothorp/mk/main/scripts/path-install.sh | bash 


# curl https://raw.githubusercontent.com/leothorp/mk/main/scripts/path-install.sh | bash -s macos

 #macos, linux, win.exe
