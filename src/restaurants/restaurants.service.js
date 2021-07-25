"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.RestaurantService = void 0;
var restaurant_entity_1 = require("./entities/restaurant.entity");
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var RestaurantService = /** @class */ (function () {
    function RestaurantService(restaurants) {
        this.restaurants = restaurants;
    }
    RestaurantService.prototype.getAll = function () {
        var restaurants = this.restaurants.find();
        return restaurants;
    };
    RestaurantService.prototype.findOne = function (id) {
        return this.restaurants.findOne(id);
    };
    RestaurantService.prototype.createRestaurant = function (restaurantDto) {
        var newRestaurant = this.restaurants.create(restaurantDto);
        return this.restaurants.save(newRestaurant);
    };
    RestaurantService.prototype.updateRestaurant = function (_a) {
        var id = _a.id, data = _a.data;
        return this.restaurants.update(id, __assign({}, data));
    };
    RestaurantService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(restaurant_entity_1.Restaurant))
    ], RestaurantService);
    return RestaurantService;
}());
exports.RestaurantService = RestaurantService;
