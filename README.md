# ip-whitelist [![Build Status](https://travis-ci.org/mbrandau/ip-whitelist.svg?branch=master)](https://travis-ci.org/mbrandau/ip-whitelist)
Basic middleware for whitelisting ip addresses

## Usage

Install and save the package to your project `npm i --save ip-whitelist`

```js
const ipWhitelist = require('ip-whitelist'), path = require('path');

// Use the predefined array callback
// NOTE: Changes in the array you pass to ipWhitelist.array will not be considered!
app.use(ipWhitelist(ipWhitelist.array(['127.0.0.1', '::1'])));

// Use the predefined file callback
app.use(ipWhitelist(ipWhitelist.file(path.join(__dirname, 'whitelist.txt'))));

// Create your own callback
app.use(ipWhitelist(ip => {
    return ip === '127.0.0.1' || ip === '::1';
}));
```

### More advanced usage

```js
const ipWhitelist = require('ip-whitelist');

let whitelist = [];

app.use(ipWhitelist(ip => {
    return whitelist.indexOf(ip) !== -1;
}));
app.post('/api/whitelist/:ip', (req, res) => {
    whitelist.push(req.params.ip);
    res.end();
});
app.get('/api/whitelist', (req, res) => {
    res.json(whitelist);
});
```