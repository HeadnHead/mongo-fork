import { map } from 'lodash';
import { get, find, first } from 'lodash/fp';

// Particular connection to MongoDB
import Connection from './connection';

// Some helper functions
import { byName } from './helper';

const findDefaultConnection = find(get('default'));

class Connector {
  constructor({ mongoose, connections }) {
    this.ready = false;
    this.createConnections(mongoose, connections)
      .then(() => {
        this.ready = true;
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

  async waitToBeReady() {
    if (this.ready) {
      return true;
    }

    return new Promise(res => setTimeout(res, 500))
      .then(() => this.waitToBeReady());
  }

  connect(name) {
    if (!this.ready) {
      return false;
    }

    return find(byName(name), this.connections);
  }

  use(modelName) {
    if (!this.ready) {
      return false;
    }

    return this.defaultConnection.use(modelName);
  }

  async disconnect() {
    if (!this.ready) {
      return false;
    }

    return Promise.all(map(
      this.connections,
      connection => connection.close(),
    ));
  }
}

export default Connector;
