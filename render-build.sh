#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
# Install Puppeteer's Chrome
npx puppeteer sprites
npx puppeteer install
