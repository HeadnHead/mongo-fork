import mongoose from 'mongoose';
import { find, map, flow, entries } from 'lodash/fp';

// Some helper functions
import { byName } from './helper';

class Connection {
  constructor(connectionInfo) {
    this.create(connectionInfo);
  }

  /*
  * Required structure of connection:
  * {
  *   name(String), // name of the connection, like 'production', 'test', 'static'...
  *   credentials(String), // 'mongodb://localhost/db'
  *   models(Array), // [user: User, item: Item, cat: Cat, dog: Dog] (class that extends Model)
  * }
  * */
  create(connectionInfo) {
    // Save name of the connection
    this.name = connectionInfo.name;
    // First, let's create a connection using mongoose
    this.connection = mongoose.createConnection(connectionInfo.credentials);
    // Let's add this connection to each model we have here
    this.models = flow(entries, map(([name, model]) => {
      // Register model in mongoose
      const mongoose = this.connection.model(name, model);
      if (model.schema) {
        // Important not to create a new object
        return Object.assign(model, { name, mongoose });
      }
      return mongoose;
    }))(connectionInfo.models);
    console.log(`[Mongo-multiconnector] A connection was established (${connectionInfo.name})`);
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
  }
}

export default Connection;