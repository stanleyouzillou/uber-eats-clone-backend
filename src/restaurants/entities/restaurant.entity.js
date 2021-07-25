"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Restaurant = void 0;
var graphql_1 = require("@nestjs/graphql");
var class_validator_1 = require("class-validator");
var typeorm_1 = require("typeorm");
var Restaurant = /** @class */ (function () {
    function Restaurant() {
    }
    __decorate([
        graphql_1.Field(function () { return graphql_1.Int; }),
        typeorm_1.PrimaryGeneratedColumn()
    ], Restaurant.prototype, "id");
    __decorate([
        graphql_1.Field(function () { return String; }),
        typeorm_1.Column(),
        class_validator_1.IsString(),
        class_validator_1.Length(5, 25)
    ], Restaurant.prototype, "name");
    __decorate([
        graphql_1.Field(function () { return Boolean; }, { defaultValue: false }),
        typeorm_1.Column({ "default": false }),
        class_validator_1.IsOptional(),
        class_validator_1.IsBoolean()
    ], Restaurant.prototype, "isVegan");
    __decorate([
        graphql_1.Field(function () { return String; }),
        typeorm_1.Column(),
        class_validator_1.IsString()
    ], Restaurant.prototype, "address");
    __decorate([
        graphql_1.Field(function () { return String; }),
        typeorm_1.Column()
    ], Restaurant.prototype, "ownerName");
    __decorate([
        graphql_1.Field(function () { return String; }),
        typeorm_1.Column()
    ], Restaurant.prototype, "category");
    Restaurant = __decorate([
        graphql_1.ObjectType(),
        typeorm_1.Entity()
    ], Restaurant);
    return Restaurant;
}());
exports.Restaurant = Restaurant;
