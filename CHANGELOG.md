# Changelog

## 1.1.0 - Sep 5, 2017

- Added chain callback
  ```js
  const ipWhitelist = require('ip-whitelist'), path = require('path');
  app.use(ipWhitelist(ipWhitelist.chain(
    ipWhitelist.file(path.join(__dirname, 'whitelist-a.txt')),
    ipWhitelist.file(path.join(__dirname, 'whitelist-b.txt'))
  )));
  ```
- Fallback to socket IP address if req.ip is not available

## 1.0.0 - Sep 4, 2017

- Initial release