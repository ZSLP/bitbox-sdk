"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BITBOX_1 = require("./BITBOX");
var io = require("socket.io-client");
var Socket = /** @class */ (function () {
    function Socket(config) {
        if (config === void 0) { config = {}; }
        if (config.wsURL) {
            // default to passed in wsURL
            this.websocketURL = config.wsURL;
        }
        else if (config.restURL) {
            // 2nd option deprecated restURL
            this.websocketURL = config.restURL;
        }
        else {
            // fallback to WS_URL
            this.websocketURL = BITBOX_1.WS_URL;
        }
        if (config.bitsocketURL) {
            this.bitsocketURL = config.bitsocketURL;
        }
        else {
            this.bitsocketURL = BITBOX_1.BITSOCKET_URL;
        }
        if (config.callback)
            config.callback();
    }
    Socket.prototype.listen = function (query, cb) {
        if (query === "blocks" || query === "transactions") {
            this.socket = io(this.websocketURL, { transports: ["websocket"] });
            this.socket.emit(query);
            if (query === "blocks")
                this.socket.on("blocks", function (msg) { return cb(msg); });
            else if (query === "transactions")
                this.socket.on("transactions", function (msg) { return cb(msg); });
        }
        else {
            var EventSource = require("eventsource");
            var b64 = Buffer.from(JSON.stringify(query)).toString("base64");
            this.socket = new EventSource(this.bitsocketURL + "/s/" + b64);
            this.socket.onmessage = function (msg) {
                cb(msg.data);
            };
        }
    };
    Socket.prototype.close = function (cb) {
        this.socket.close();
        if (cb) {
            cb();
        }
    };
    return Socket;
}());
exports.Socket = Socket;
//# sourceMappingURL=Socket.js.map