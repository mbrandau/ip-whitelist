# Changelog

## 1.1.0 - unreleased

- Added chain callback
  ```js
  const ipWhitelist = require('ip-whitelist'), path = require('path');
  app.use(ipWhitelist(ipWhitelist.chain([
    ipWhitelist.file(path.join(__dirname, 'whitelist-a.txt')),
    ipWhitelist.file(path.join(__dirname, 'whitelist-b.txt'))
  ])));
  ```

## 1.0.0 - Sep 4, 2017

- Initial release