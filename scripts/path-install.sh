#!/usr/bin/env bash
platform="PLATFORM" && curl -sSL https://raw.githubusercontent.com/leothorp/mk/main/dist/compressed/mk-$platform.zip -O \
&& unzip -j mk-$platform.zip dist/mk-$platform -d /usr/local/bin \
&& mv /usr/local/bin/mk-$platform /usr/local/bin/mk \
&& rm mk-$platform.zip && mk --version;