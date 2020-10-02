"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidArgumentsException = void 0;
var base_exception_1 = require("./base.exception");
var InvalidArgumentsException = (function (_super) {
    __extends(InvalidArgumentsException, _super);
    function InvalidArgumentsException(message) {
        return _super.call(this, message) || this;
    }
    return InvalidArgumentsException;
}(base_exception_1.BaseException));
exports.InvalidArgumentsException = InvalidArgumentsException;
//# sourceMappingURL=invalid-arguments.exception.js.map