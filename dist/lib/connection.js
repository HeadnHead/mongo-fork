'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _fp = require('lodash/fp');

var _helper = require('./helper');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Some helper functions


class Connection {
  constructor(mongoose, connectionInfo) {
    this.mongoose = mongoose;
    this.connectionInfo = connectionInfo;
  }

  /*
  * Required structure of connection:
  * {
  *   name(String), // name of the connection, like 'production', 'test', 'static'...
  *   credentials(String), // 'mongodb://localhost/db'
  *   models(Array), // [user: User, item: Item, cat: Cat, dog: Dog] (class that extends Model)
  * }
  * */
  create() {
    var _this = this;

    return _asyncToGenerator(function* () {
      // Save name of the connection
      _this.name = _this.connectionInfo.name;

      // First, let's create a connection using mongoose
      _this.connection = yield _this.mongoose.createConnection(_this.connectionInfo.credentials);
      console.log(`[Mongo-multiconnector] A connection was established (${_this.connectionInfo.name})`);

      // Let's add this connection to each model we have here
      _this.models = (0, _fp.flow)(_fp.entries, (0, _fp.map)(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        let name = _ref2[0],
            model = _ref2[1];

        // Register model in mongoose
        const mongooseModel = _this.connection.model(name, model);
        if (model.schema) {
          // Important not to create a new object
          return Object.assign(model, { name, mongoose: mongooseModel });
        }
        return mongooseModel;
      }))(_this.connectionInfo.models);

      return _this;
    })();
  }

  // Use mongoose model
  use(modelName) {
    return this.connection.model(modelName);
  }

  // Use custom model
  useModel(modelName) {
    return (0, _fp.find)((0, _helper.byName)(modelName), this.models);
  }

  close() {
    if (this.connection) {
      return new Promise(this.connection.close);
    }

    return null;
  }
}

exports.default = Connection;