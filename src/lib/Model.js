import mongoose from 'mongoose';

class Model {
  constructor(connection) {
    // As soon as you create an object,
    // you need to attach connection to
    // this model and register model via mongoose
    this.setConnectionAndRegisterModel(connection);
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

  itself() {
    return this.model;
  }

  static name = '';
  static schema = {};
  static autoIndex = false;

  model = null;
  connection = null;
}

export default Model;
