import mongoose from 'mongoose';
import { find, map } from 'lodash/fp';

// Some helper functions
import { byName } from './helper';

class Connection {
  constructor(connectionInfo) {
    return this.create(connectionInfo);
  }

  /*
  * Required structure of connection:
  * {
  *   name(String), // name of the connection, like 'production', 'test', 'static'...
  *   credentials(String), // 'mongodb://localhost/db'
  *   models(Array), // [User, Item, Cat, Dog] (class that extends Model)
  * }
  * */
  create(connectionInfo) {
    // First, let's create a connection using mongoose
    this.connection = mongoose.createConnection(connectionInfo.credentials);
    // Let's add this connection to each model we have here
    this.models = map(Model => new Model(this.connection), connectionInfo.models);
    // Return the connection we have built
    return this;
  }

  getModel(modelName) {
    return find(byName(modelName))(this.models);
  }

  use(modelName) {
    try {
      return this.getModel(modelName).mongooseModel();
    }
    catch (e) {
      // In case the model by that model name does not exist
      return null;
    }
  }

  name = '';
  models = null;
  connection = null;
}

export default Connection;