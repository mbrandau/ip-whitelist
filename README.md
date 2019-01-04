# ip-whitelist

[![Build Status](https://img.shields.io/travis/mbrandau/ip-whitelist.svg)](https://travis-ci.org/mbrandau/ip-whitelist) [![David](https://img.shields.io/david/mbrandau/ip-whitelist.svg)](https://david-dm.org/mbrandau/ip-whitelist) [![Coveralls](https://img.shields.io/coveralls/mbrandau/ip-whitelist.svg)](https://coveralls.io/github/mbrandau/ip-whitelist) [![npm](https://img.shields.io/npm/v/ip-whitelist.svg)](https://www.npmjs.com/package/ip-whitelist) [![npm](https://img.shields.io/npm/dt/ip-whitelist.svg)](https://www.npmjs.com/package/ip-whitelist) [![GitHub issues](https://img.shields.io/github/issues/mbrandau/ip-whitelist.svg)](https://github.com/mbrandau/ip-whitelist/issues) ![](https://img.shields.io/snyk/vulnerabilities/npm/ip-whitelist.svg)

Basic middleware for whitelisting ip addresses

Looking for an ip-blacklist? Check out the pendant to this package at [npm](https://www.npmjs.com/package/ip-blacklist) or [GitHub](https://github.com/mbrandau/ip-blacklist)

## Usage

Install and save the package to your project `npm i --save ip-whitelist`

```js
const ipWhitelist = require('ip-whitelist'), path = require('path');

// Use the predefined array callback
// NOTE: Changes in the array you pass to ipWhitelist.array will not be considered!
app.use(ipWhitelist(ipWhitelist.array(['127.0.0.1', '::1'])));

// Use the predefined file callback
// NOTE: One line in the file represents an IP address
app.use(ipWhitelist(ipWhitelist.file(path.join(__dirname, 'whitelist.txt'))));

// Create your own callback
app.use(ipWhitelist(ip => {
    return ip === '127.0.0.1' || ip === '::1';
}));

// Chain multiple callbacks
app.use(ipWhitelist(ipWhitelist.chain(
    ipWhitelist.file(path.join(__dirname, 'whitelist-a.txt')),
    ipWhitelist.file(path.join(__dirname, 'whitelist-b.txt'))
)));
```

### More advanced usage

The default behaviour when handling a blocked IP is to end the request with status 403 and 'IP not whitelisted'.
To change that, pass a function as a second parameter to `ipWhitelist()`. This function takes to arguments: `req` and `res`.

```js
const ipWhitelist = require('ip-whitelist');

let whitelist = [];

app.use(ipWhitelist(ip => {
    return whitelist.indexOf(ip) !== -1;
}, function (req, res) { // Custom handling of blocked IPs
  res.statusCode = 500;
  res.end('You shall not pass!');
}));
app.post('/api/whitelist/:ip', (req, res) => {
    whitelist.push(req.params.ip);
    res.end('Added IP to whitelist');
});
app.get('/api/whitelist', (req, res) => {
    res.json(whitelist);
});
```
