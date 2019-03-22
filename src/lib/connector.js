import { get, map, find, first, flow } from 'lodash/fp';

// Particular connection to MongoDB
import Connection from './connection';

// Some helper functions
import { byName } from './helper';

const createConnections = map(connection => new Connection(connection));
const findDefaultConnection = find(get('default'));

class Connector {
  constructor({ connections }) {
    this.connections = createConnections(connections);
    this.defaultConnection = findDefaultConnection(connections) || first(this.connections);
    console.log('[Mongo-multiconnector] Connector was created')
  }

  connect(name) {
    return find(byName(name), this.connections);
  }

  use(modelName) {
    return this.defaultConnection.use(modelName);
  }

  async disconnect() {
    await Promise.all(
      map(
        this.connections,
        connection => connection.close()
      ),
    );
  }
}

export default Connector;
