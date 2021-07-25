#!/usr/bin/env bash
curl -sSL https://raw.githubusercontent.com/leothorp/mk/main/dist/compressed/mk-macos.zip -O && \ 
unzip mk-macos.zip -d /usr/local/bin && rm mk-macos.zip && \
mk --version;