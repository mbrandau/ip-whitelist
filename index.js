module.exports = ipWhitelist;
module.exports.array = arrayCallback;
module.exports.file = fileCallback;
module.exports.chain = chainCallback;

const fs = require('fs'), ipaddr = require('ipaddr.js');

function ipWhitelist(callback) {
    return function middleware(req, res, next) {
        const whitelisted = callback(req.ip);
        if (whitelisted) next();
        else {
            res.statusCode = 403;
            res.end('IP not whitelisted');
        }
    }
}

function arrayCallback(array) {
    let ipAddresses = [];
    array.forEach(el => {
        if (ipaddr.isValid(el)) ipAddresses.push(el);
    });
    return function (ip) {
        return ipAddresses.indexOf(ip) !== -1;
    }
}

function fileCallback(file) {
    return arrayCallback(fs.readFileSync(file).toString().split('\n'));
}

function chainCallback(callbacks) {
    return function (ip) {
        for (let i = 0; i < callbacks.length; i++) if (callbacks[i](ip)) return true;
        return false;
    }
}