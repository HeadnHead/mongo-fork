'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// Some helper functions


var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _fp = require('lodash/fp');

var _helper = require('./helper');

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Initialize models

class Connection {
  constructor(connectionInfo) {
    this.create(connectionInfo);
  }

  /*
  * Required structure of connection:
  * {
  *   name(String), // name of the connection, like 'production', 'test', 'static'...
  *   credentials(String), // 'mongodb://localhost/db'
  *   models(Array), // [user: User, item: Item, cat: Cat, dog: Dog] (class that extends Model)
  * }
  * */
  create(connectionInfo) {
    // Save name of the connection
    this.name = connectionInfo.name;
    // First, let's create a connection using mongoose
    this.connection = _mongoose2.default.createConnection(connectionInfo.credentials);
    // Let's add this connection to each model we have here
    this.models = (0, _fp.flow)(_fp.entries, (0, _fp.map)((_ref) => {
      var _ref2 = _slicedToArray(_ref, 2);

      let name = _ref2[0],
          model = _ref2[1];

      // Register model in mongoose
      const mongoose = this.connection.model(name, model);
      if (model.schema) {
        // Important not to create a new object
        return Object.assign(model, { name, mongoose });
      }
      return mongoose;
    }))(connectionInfo.models);
  }

  // Use mongoose model
  use(modelName) {
    return this.connection.model(modelName);
  }

  // Use custom model
  useModel(modelName) {
    return (0, _fp.find)((0, _helper.byName)(modelName), this.models);
  }
}

exports.default = Connection;