#!/usr/bin/env bash
curl -sSL https://raw.githubusercontent.com/leothorp/mk/main/dist/compressed/mk-${platform}.zip -O \
&& unzip mk-${platform}.zip -d /usr/local/bin \
&& mv /usr/local/bin mk-${platform} /usr/local/bin/mk
&& rm mk-${platform}.zip && mk --version;



# curl -sSL https://raw.githubusercontent.com/leothorp/mk/main/scripts/path-install.sh | bash 


# platform=macos; curl https://raw.githubusercontent.com/leothorp/mk/main/scripts/path-install.sh | bash -s ${platform}

 #macos, linux, win.exe
