import mongoose from 'mongoose';
import { get, map, find, flow } from 'lodash/fp';

// Particular connection to MongoDB
import Connection from './Connection';

// Some helper functions
import { byName } from './helper';

class Connector {
  constructor(connectionList, defaultConnectionName = '') {
    this.defaultConnectionName = defaultConnectionName;
    this.connections = map(connection => new Connection(connection), connectionList);
  }

  getConnection(connectionName = this.defaultConnectionName) {
    return find(byName(connectionName)(this.connections));
  }
}

export default Connector;
