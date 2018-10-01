module.exports = ipWhitelist;
module.exports.array = arrayCallback;
module.exports.file = fileCallback;
module.exports.chain = chainCallback;

const fs = require('fs'),
  ipaddr = require('ipaddr.js');

function ipWhitelist(callback, onBlocked) {
  if (!onBlocked)
    onBlocked = function(req, res) {
      // If not whitelisted end the request with code 403 (Forbidden)
      res.statusCode = 403;
      res.end('IP not whitelisted');
    };

  // Return middleware function
  return function middleware(req, res, next) {
    const ip = req.ip || req.socket.remoteAddress;

    // Check if the IP is whitelisted
    const whitelisted = callback(ip);

    // Pass on to next middleware if whitelisted
    if (whitelisted) next();
    else onBlocked(req, res);
  };
}

function arrayCallback(array) {
  let ipAddresses = [];
  // Iterate through array and sort out invalid IPs
  array.forEach(el => {
    if (ipaddr.isValid(el)) ipAddresses.push(el);
  });
  return function(ip) {
    // Check if given IP is inside the array
    return ipAddresses.indexOf(ip) !== -1;
  };
}

function fileCallback(file) {
  // Read lines from file and pass them to the array callback
  return arrayCallback(
    fs
      .readFileSync(file)
      .toString()
      .split('\n')
  );
}

function chainCallback(callbacks) {
  // Don't break old usage with passing an array of callbacks
  if (arguments.length > 1) {
    // Turn passed arguments into an array
    callbacks = Array.prototype.slice.call(arguments);
  }
  return function(ip) {
    // Iterate through all the callbacks and check if the IP is whitelisted. If that is the case,
    // return true, otherwise iterate through the rest and return false.
    for (let i = 0; i < callbacks.length; i++)
      if (callbacks[i](ip)) return true;
    return false;
  };
}
