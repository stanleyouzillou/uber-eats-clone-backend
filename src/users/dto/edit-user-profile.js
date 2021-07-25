"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EditProfileOutput = exports.EditProfileInput = void 0;
var output_dto_1 = require("../../common/dtos/output.dto");
var graphql_1 = require("@nestjs/graphql");
var user_entity_1 = require("../entities/user.entity");
var EditProfileInput = /** @class */ (function (_super) {
    __extends(EditProfileInput, _super);
    function EditProfileInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EditProfileInput = __decorate([
        graphql_1.InputType()
    ], EditProfileInput);
    return EditProfileInput;
}(graphql_1.PartialType(graphql_1.PickType(user_entity_1.User, ['email', 'password']))));
exports.EditProfileInput = EditProfileInput;
var EditProfileOutput = /** @class */ (function (_super) {
    __extends(EditProfileOutput, _super);
    function EditProfileOutput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        graphql_1.Field(function (type) { return user_entity_1.User; }, { nullable: true })
    ], EditProfileOutput.prototype, "user");
    EditProfileOutput = __decorate([
        graphql_1.ObjectType()
    ], EditProfileOutput);
    return EditProfileOutput;
}(output_dto_1.MutationOutput));
exports.EditProfileOutput = EditProfileOutput;
