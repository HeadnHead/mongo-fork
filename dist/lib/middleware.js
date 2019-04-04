'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _genericPool = require('generic-pool');

var _genericPool2 = _interopRequireDefault(_genericPool);

var _connector = require('./connector');

var _connector2 = _interopRequireDefault(_connector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } // Inspired by https://github.com/nswbmw/koa-mongo/


const middleware = function (config) {
  let priority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (!config.opts || !config.connections) {
    throw new Error('Invalid config');
  }
  /*
   * Config consists of:
   * {
   *    opts,
   *    connections
   * }
   * */
  // Let's create a pool
  const pool = _genericPool2.default.createPool({
    create: () => new _connector2.default(config),
    destroy: client => client.disconnect()
  }, config.opts);

  const release = (() => {
    var _ref = _asyncToGenerator(function* (resource) {
      yield pool.release(resource);
    });

    return function release(_x2) {
      return _ref.apply(this, arguments);
    };
  })();

  return (() => {
    var _ref2 = _asyncToGenerator(function* (ctx, next) {
      return pool.acquire(priority).then((() => {
        var _ref3 = _asyncToGenerator(function* (db) {
          yield db.waitToBeReady();
          ctx.mongo = db;
          return next();
        });

        return function (_x5) {
          return _ref3.apply(this, arguments);
        };
      })()).then(_asyncToGenerator(function* () {
        yield release(ctx.mongo);
      })).catch((() => {
        var _ref5 = _asyncToGenerator(function* (e) {
          yield release(ctx.mongo);
          throw e;
        });

        return function (_x6) {
          return _ref5.apply(this, arguments);
        };
      })());
    });

    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  })();
};

exports.default = middleware;