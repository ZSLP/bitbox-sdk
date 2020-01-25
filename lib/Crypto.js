"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var randombytes_1 = __importDefault(require("randombytes"));
var Bitcoin = require("@bitcoin-dot-com/bitcoincashjs2-lib");
var Crypto = /** @class */ (function () {
    function Crypto() {
    }
    Crypto.prototype.sha1 = function (buffer) {
        return Bitcoin.crypto.sha1(buffer);
    };
    Crypto.prototype.sha256 = function (buffer) {
        return Bitcoin.crypto.sha256(buffer);
    };
    Crypto.prototype.ripemd160 = function (buffer) {
        return Bitcoin.crypto.ripemd160(buffer);
    };
    Crypto.prototype.hash256 = function (buffer) {
        return Bitcoin.crypto.hash256(buffer);
    };
    Crypto.prototype.hash160 = function (buffer) {
        return Bitcoin.crypto.hash160(buffer);
    };
    Crypto.prototype.randomBytes = function (size) {
        if (size === void 0) { size = 16; }
        return randombytes_1.default(size);
    };
    return Crypto;
}());
exports.Crypto = Crypto;
//# sourceMappingURL=Crypto.js.map