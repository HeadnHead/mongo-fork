// Inspired by https://github.com/nswbmw/koa-mongo/
import genericPool from 'generic-pool';
import Connector from './connector';

const middleware = (config, priority = 0) => {
  if (!config.opts || !config.connections) {
    throw 'Invalid config';
  }
  /*
   * Config consists of:
   * {
   *    opts,
   *    connections
   * }
   * */
  // Let's create a pool
  const pool = genericPool.createPool({
    create: () => new Connector(config),
    destroy: client => client.close(),
  }, config.opts);

  const release = async (resource) => {
    await pool.release(resource);
  };

  return async (ctx, next) => {
    return pool.acquire(priority)
      .then(async (db) => {
        ctx.mongo = db;
        return next();
      })
      .then(async () => {
        await release(ctx.mongo);
      })
      .catch(async (e) => {
        await release(ctx.mongo);
        throw e;
      });
  };
};

export { middleware };

