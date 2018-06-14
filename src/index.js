import Model from './lib/Model';
import Connector from './lib/Connector';
import { middleware } from './lib/middleware';

const mongo = (connectionList, defaultName = '') => {
  return {
    close: () => console.log('supposed to close'), // TODO:?
    connection: (new Connector(connectionList, defaultName)).getConnection,
  };
};

export {
  mongo,
  Model,
  Connector,
  middleware,
};
