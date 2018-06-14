import { get, map, find, flow } from 'lodash/fp';
import mongoose from 'mongoose';

// Some helper functions
const byName = name => o => o.name === name;

class Connector {
  constructor(connectionList, defaultConnectionName = '') {
    this.connections = map(this.buildConnection, connectionList);
    this.defaultConnectionName = defaultConnectionName;
  }

  /*
  * Required structure of connection:
  * {
  *   name(String), // name of the connection, like 'production', 'test', 'static'...
  *   credentials(String), // 'mongodb://localhost/db'
  *   models(Array), // [User, Item, Cat, Dog] (class that extends Model)
  * }
  * */
  buildConnection(connectionInfo) {
    // First, let's create a connection using mongoose
    const connection = mongoose.createConnection(connectionInfo.credentials);
    // Let's add this connection to each model we have here
    const models = map(Model => new Model(connection), connection.models);
    // Return the connection we have built
    return {
      models,
      connection,
      name: connectionInfo.name,
      use: this.getModelItself,
    };
  }

  getModel(modelName, connectionName = this.defaultConnectionName) {
    return flow(
      find(byName(connectionName)),
      get('models'),
      find(byName(modelName)),
    )(this.connections);
  }

  getModelItself(modelName, connectionName) {
    try {
      return this.getModel(modelName, connectionName).itself();
    }
    catch (e) {
      // In case the model by that model name does not exist
      return null;
    }
  }

  getConnection(connectionName = this.defaultConnectionName) {
    return find(byName(connectionName)(this.connections));
  }

}

export default Connector;
