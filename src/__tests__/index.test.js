import mongoose from 'mongoose';

import Model from '../lib/model';
import Connector from '../lib/connector';

class User extends Model {
  static rules = {
    lastname: { type: String, trim: true },
    updated_at: Date,
    created_at: Date,
  };

  scopeCreateOurNewUser() {
    console.log('scopeCreate', this.rules);
  }
}

const testSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  updated_at: Date,
  created_at: Date,
}, { autoIndex: false });

const connections = [{
  name: 'production',
  credentials: '',
  models: { test: testSchema, user: new User() },
}];

test('Test mongoose connection and creating a schema', async () => {
  const connector = new Connector({ connections });
  const model = connector.connect('production').use('test');
  const user = connector.connect('production').useModel('user');
  user.createOurNewUser();
  console.log(await user.mongoose.find({}).exec());
  console.log(await model.find({}).exec());
});
