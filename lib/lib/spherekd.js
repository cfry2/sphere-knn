"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var kd = require("./kd"),
    rad = Math.PI / 180,
    invEarthDiameter = 1 / 12742018 /* meters */;

function spherical2cartesian(lat, lon) {
  lat *= Math.PI / 180;
  lon *= Math.PI / 180;
  var cos = Math.cos(lat);
  return [cos * Math.cos(lon), Math.sin(lat), cos * Math.sin(lon)];
}

var Position = function () {
  function Position(object) {
    _classCallCheck(this, Position);

    var lat = NaN,
        lon = NaN;

    if (Array.isArray(object)) {
      lat = object[0];
      lon = object[1];
    } else if (object.hasOwnProperty("location")) {
      lat = object.location[0];
      lon = object.location[1];
    } else if (object.hasOwnProperty("position")) {
      lat = object.position[0];
      lon = object.position[1];
    } else if (object.hasOwnProperty("geometry") && object.geometry.hasOwnProperty("type") && object.geometry.type === "Point") {
      lat = object.geometry.coordinates[1];
      lon = object.geometry.coordinates[0];
    } else {
      if (object.hasOwnProperty("lat")) {
        lat = object.lat;
      } else if (object.hasOwnProperty("latitude")) {
        lat = object.latitude;
      }

      if (object.hasOwnProperty("lon")) {
        lon = object.lon;
      } else if (object.hasOwnProperty("lng")) {
        lon = object.lng;
      } else if (object.hasOwnProperty("long")) {
        lon = object.long;
      } else if (object.hasOwnProperty("longitude")) {
        lon = object.longitude;
      }
    }

    this.object = object;
    this.position = spherical2cartesian(lat, lon);
  }

  _createClass(Position, null, [{
    key: "create",
    value: function create(object) {
      return new Position(object);
    }
  }, {
    key: "extract",
    value: function extract(position) {
      return position.object;
    }
  }]);

  return Position;
}();

function build(array) {
  return kd.build(array.map(Position.create));
}

function lookup(lat, lon, node, n, max) {
  return kd.lookup(spherical2cartesian(lat, lon), node, n, max > 0 ? 2 * Math.sin(max * invEarthDiameter) : undefined).map(Position.extract);
}

exports.build = build;
exports.lookup = lookup;