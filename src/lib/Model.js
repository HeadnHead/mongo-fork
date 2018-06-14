import mongoose from 'mongoose';

class Model {
  constructor(connection) {
    const handler = {
      get(obj, prop) {
        return prop in obj ? obj[prop] : Model.getScopeFunction(prop, obj);
      },
    };

    // As soon as you create an object,
    // you need to attach connection to
    // this model and register model via mongoose
    this.setConnectionAndRegisterModel(connection);

    // Use proxy to add custom functions
    return new Proxy(this, handler);
  }

  static getScopeFunction(prop, obj) {
    const addScorePrefix = s => `scope${s}`;
    const firstUpperCase = s => s.charAt(0).toUpperCase() + s.substr(1);

    // Search for scope property
    const scoreProp = addScorePrefix(firstUpperCase(prop));
    return obj[scoreProp] ? obj[scoreProp] : null;
  }

  setConnectionAndRegisterModel(c) {
    this.connection = c;
    this.registerModel();
  }

  registerModel() {
    // Create mongoose model
    this.model = this.connection.model(
      Model.name,
      new mongoose.Schema(Model.schema, Model.autoIndex),
    );
  }

  beforeSave(next) {
    // Before saving
    console.log('before-saving', this.model);
    next();
  }

  afterSave(next) {
    // After saving
    console.log('after-saving', this.model);
    next();
  }

  mongooseModel() {
    return this.model;
  }

  static name = '';
  static schema = {};
  static autoIndex = false;

  model = null;
  connection = null;
}

export default Model;
