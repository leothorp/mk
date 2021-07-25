#!/usr/bin/env bash
 
 npm version patch && \
 npm publish --access public && \
 git push origin HEAD && \
 git push --tags