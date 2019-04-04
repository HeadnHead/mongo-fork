'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _fp = require('lodash/fp');

var _connection = require('./connection');

var _connection2 = _interopRequireDefault(_connection);

var _helper = require('./helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Particular connection to MongoDB


// Some helper functions


const findDefaultConnection = (0, _fp.find)((0, _fp.get)('default'));

class Connector {
  constructor(_ref) {
    let mongoose = _ref.mongoose,
        connections = _ref.connections;

    this.ready = false;
    this.createConnections(mongoose, connections).then(() => {
      this.ready = true;
      console.log('[Mongo-multiconnector] Connector was created');
    });
  }

  createConnections(mongoose, connectionsData) {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.connections = yield Promise.all((0, _lodash.map)(connectionsData, function (connectionData) {
        const connection = new _connection2.default(mongoose, connectionData);
        return connection.create();
      }));

      _this.defaultConnection = findDefaultConnection(_this.connections) || (0, _fp.first)(_this.connections);
    })();
  }

  waitToBeReady() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (_this2.ready) {
        return true;
      }

      return new Promise(function (res) {
        return setTimeout(res, 500);
      }).then(function () {
        return _this2.waitToBeReady();
      });
    })();
  }

  connect(name) {
    if (!this.ready) {
      return false;
    }

    return (0, _fp.find)((0, _helper.byName)(name), this.connections);
  }

  use(modelName) {
    if (!this.ready) {
      return false;
    }

    return this.defaultConnection.use(modelName);
  }

  disconnect() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      if (!_this3.ready) {
        return false;
      }

      return Promise.all((0, _lodash.map)(_this3.connections, function (connection) {
        return connection.close();
      }));
    })();
  }
}

exports.default = Connector;