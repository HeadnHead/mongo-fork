'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fp = require('lodash/fp');

var _connection = require('./connection');

var _connection2 = _interopRequireDefault(_connection);

var _helper = require('./helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Particular connection to MongoDB


// Some helper functions


const createConnections = (0, _fp.map)(connection => new _connection2.default(connection));
const findDefaultConnection = (0, _fp.find)((0, _fp.get)('default'));

class Connector {
  constructor(_ref) {
    let connections = _ref.connections;

    this.connections = createConnections(connections);
    this.defaultConnection = findDefaultConnection(connections) || (0, _fp.first)(this.connections);
    console.log('[Mongo-multiconnector] Connector was created');
  }

  connect(name) {
    return (0, _fp.find)((0, _helper.byName)(name), this.connections);
  }

  use(modelName) {
    return this.defaultConnection.use(modelName);
  }

  disconnect() {
    var _this = this;

    return _asyncToGenerator(function* () {
      yield Promise.all((0, _fp.map)(_this.connections, function (connection) {
        return connection.close();
      }));
    })();
  }
}

exports.default = Connector;