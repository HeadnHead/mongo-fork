import mongoose from 'mongoose';
import { find, map } from 'lodash/fp';

// Some helper functions
import { byName } from './helper';
import Model from "./model";

// Initialize models

class Connection {
  constructor(connectionInfo) {
    return this.create(connectionInfo);
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
    this.models = map((model, name) => this.connection.model(name, model), connectionInfo.models);
    // Return the connection we have built
    return this;
  }

  use(modelName) {
    return find(byName(modelName), this.models) || null;
  }

  name = '';
  models = null;
  connection = null;
}

export default Connection;