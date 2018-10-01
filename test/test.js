const assert = require("assert"),
  expect = require("expect.js"),
  ipWhitelist = require("../index"),
  path = require("path");
describe("ip-whitelist", function() {
  it("should expose a function", () => expect(ipWhitelist).to.be.a("function"));
  describe("middleware", function() {
    it("should fallback to req.socket.remoteAddress if req.ip is not set", function(done) {
      const middleware = ipWhitelist(ip => ip == "127.0.0.15");

      const req = {
        socket: {
          remoteAddress: "127.0.0.15"
        }
      };
      const res = {
        statusCode: 200,
        end: function(msg) {
          expect().fail("req.end() should not be called here");
        }
      };

      middleware(req, res, function() {
        done();
      });
    });
    it("should call next middleware", function(done) {
      const middleware = ipWhitelist(ipWhitelist.array(["127.0.0.1"]));
      middleware(
        {
          ip: "127.0.0.1"
        },
        {},
        function() {
          done();
        }
      );
    });
    it("should end request with code 403", function(done) {
      const middleware = ipWhitelist(ipWhitelist.array(["127.0.0.1"]));
      const req = {
        statusCode: 200
      };
      req.end = function(msg) {
        expect(msg).to.be("IP not whitelisted");
        expect(req.statusCode).to.be(403);
        done();
      };
      middleware(
        {
          ip: "127.0.0.2"
        },
        req,
        function() {
          expect().fail("Should not call next() here");
        }
      );
    });
    it("should handle custom onBlocked handler correctly", function(done) {
      const middleware = ipWhitelist(ipWhitelist.array(["127.0.0.1"]), function(
        req,
        res
      ) {
        res.statusCode = 500;
        res.end("Unavailable");
      });
      const req = {
        statusCode: 200
      };
      req.end = function(msg) {
        expect(msg).to.be("Unavailable");
        expect(req.statusCode).to.be(500);
        done();
      };
      middleware(
        {
          ip: "127.0.0.2"
        },
        req,
        function() {
          expect().fail("Should not call next() here");
        }
      );
    });
  });
  describe("#array()", function() {
    const cb = ipWhitelist.array([
      "127.0.0.1",
      "::1",
      "i am not an ip address"
    ]);
    it("should return true when the ip is 127.0.0.1", () =>
      assert.equal(true, cb("127.0.0.1")));
    it("should return true when the ip is ::1", () =>
      assert.equal(true, cb("::1")));
    it("should return false when the ip is 127.0.0.2", () =>
      assert.equal(false, cb("127.0.0.2")));
    it("should return false when the ip is ::2", () =>
      assert.equal(false, cb("::2")));
    it("should filter out invalid IP addresses", function() {
      expect(cb("i am not an ip address")).to.be(false);
    });
  });
  describe("#file()", function() {
    const cb = ipWhitelist.file(path.join(__dirname, "ips.txt"));
    it("should return true when the ip is 127.0.0.1", () =>
      assert.equal(true, cb("127.0.0.1")));
    it("should return true when the ip is ::1", () =>
      assert.equal(true, cb("::1")));
    it("should return false when the ip is 127.0.0.2", () =>
      assert.equal(false, cb("127.0.0.2")));
    it("should return false when the ip is ::2", () =>
      assert.equal(false, cb("::2")));
  });
  describe("#chain()", () => {
    describe("#chain([cb1, cb2])", function() {
      const cb = ipWhitelist.chain([
        ipWhitelist.file(path.join(__dirname, "ips.txt")),
        ipWhitelist.array(["127.0.0.3", "::3"])
      ]);
      it("should return true when the ip is 127.0.0.1", () =>
        assert.equal(true, cb("127.0.0.1")));
      it("should return true when the ip is ::1", () =>
        assert.equal(true, cb("::1")));
      it("should return false when the ip is 127.0.0.2", () =>
        assert.equal(false, cb("127.0.0.2")));
      it("should return false when the ip is ::2", () =>
        assert.equal(false, cb("::2")));
      it("should return true when the ip is 127.0.0.3", () =>
        assert.equal(true, cb("127.0.0.3")));
      it("should return true when the ip is ::3", () =>
        assert.equal(true, cb("::3")));
    });
    describe("#chain(cb1, cb2)", function() {
      const cb = ipWhitelist.chain(
        ipWhitelist.file(path.join(__dirname, "ips.txt")),
        ipWhitelist.array(["127.0.0.3", "::3"])
      );
      it("should return true when the ip is 127.0.0.1", () =>
        assert.equal(true, cb("127.0.0.1")));
      it("should return true when the ip is ::1", () =>
        assert.equal(true, cb("::1")));
      it("should return false when the ip is 127.0.0.2", () =>
        assert.equal(false, cb("127.0.0.2")));
      it("should return false when the ip is ::2", () =>
        assert.equal(false, cb("::2")));
      it("should return true when the ip is 127.0.0.3", () =>
        assert.equal(true, cb("127.0.0.3")));
      it("should return true when the ip is ::3", () =>
        assert.equal(true, cb("::3")));
    });
  });
});
