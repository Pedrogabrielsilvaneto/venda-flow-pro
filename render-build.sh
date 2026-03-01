#!/usr/bin/env bash
# exit on error
set -o errexit

npm install

# Install puppeteer browsers explicitly to ensure Chrome is present
npx puppeteer browsers install chrome
