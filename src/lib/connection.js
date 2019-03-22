import {
  find,
  map,
  flow,
  entries,
} from 'lodash/fp';

// Some helper functions
import { byName } from './helper';

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
  async create() {
    // Save name of the connection
    this.name = this.connectionInfo.name;

    // First, let's create a connection using mongoose
    this.connection = await this.mongoose.createConnection(this.connectionInfo.credentials);
    console.log(`[Mongo-multiconnector] A connection was established (${this.connectionInfo.name})`);

    // Let's add this connection to each model we have here
    this.models = flow(entries, map(([name, model]) => {
      // Register model in mongoose
      const mongooseModel = this.connection.model(name, model);
      if (model.schema) {
        // Important not to create a new object
        return Object.assign(model, { name, mongoose: mongooseModel });
      }
      return mongooseModel;
    }))(this.connectionInfo.models);

    return this;
  }

  // Use mongoose model
  use(modelName) {
    return this.connection.model(modelName);
  }

  // Use custom model
  useModel(modelName) {
    return find(byName(modelName), this.models);
  }

  close() {
    if (this.connection) {
      return new Promise(this.connection.close);
    }

    return null;
  }
}

export default Connection;
