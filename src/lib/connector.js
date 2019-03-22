import { map } from 'lodash';
import { get, find, first } from 'lodash/fp';

// Particular connection to MongoDB
import Connection from './connection';

// Some helper functions
import { byName } from './helper';

const findDefaultConnection = find(get('default'));

class Connector {
  constructor({ mongoose, connections }) {
    this.createConnections(mongoose, connections)
      .then(() => {
        console.log('[Mongo-multiconnector] Connector was created');
      });
  }

  async createConnections(mongoose, connectionsData) {
    this.connections = await Promise.all(map(connectionsData, (connectionData) => {
      const connection = new Connection(mongoose, connectionData);
      return connection.create();
    }));

    this.defaultConnection = findDefaultConnection(this.connections) || first(this.connections);
  }

  connect(name) {
    return find(byName(name), this.connections);
  }

  use(modelName) {
    return this.defaultConnection.use(modelName);
  }

  async disconnect() {
    await Promise.all(map(
      this.connections,
      connection => connection.close(),
    ));
  }
}

export default Connector;
