'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _fp = require('lodash/fp');

var _connection = require('./connection');

var _connection2 = _interopRequireDefault(_connection);

var _helper = require('./helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Particular connection to MongoDB
const createConnections = (0, _fp.map)(connection => new _connection2.default(connection));

// Some helper functions

const findDefaultConnection = (0, _fp.find)((0, _fp.get)('default'));

class Connector {
  constructor(_ref) {
    let connections = _ref.connections;

    this.connections = createConnections(connections);
    this.defaultConnection = findDefaultConnection(connections) || (0, _fp.first)(this.connections);
  }

  connect(name) {
    return (0, _fp.find)((0, _helper.byName)(name), this.connections);
  }

  use(modelName) {
    return this.defaultConnection.use(modelName);
  }
}

exports.default = Connector;