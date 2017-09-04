# ip-whitelist
Basic middleware for whitelisting ip addresses

## Usage

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