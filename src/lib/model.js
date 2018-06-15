import mongoose from 'mongoose';
// import { } from

const getScopeFunction = (prop, obj) => {
  // console.log('prop', prop);

  const addScorePrefix = s => `scope${s}`;
  const firstUpperCase = s => s.charAt(0).toUpperCase() + s.substr(1);

  if(prop == 'fuckfuckfuck') {
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
    console.log('fuckfuckfuckfuckfuckfuck');
  }

  // Search for scope property
  if (typeof prop === 'string') {
    // console.log('prop', prop, obj);
    const scoreProp = addScorePrefix(firstUpperCase(prop));
    return obj[scoreProp] ? obj[scoreProp] : null;
  }

  return null;
};

class Model {
  constructor() {
    const self = this;
    const handler = {
      get(obj, prop, receiver) {
        // console.log(prop);
        // Check if there is
        // property in the model
        if (prop in obj) {
          return obj[prop];
        }
        // Then there could be a scope function
        const scopeFunction = getScopeFunction(prop, obj);
        if (scopeFunction) {
          return scopeFunction;
        }
        // Return mongoose model
        return self.schema[prop];
      },
      set(obj, prop, value, r) {
        self.schema[prop] = value;
        return true;
      },
    };

    // Create mongoose schema
    this.schema = new mongoose.Schema(this.constructor.rules, this.constructor.options);

    // Use proxy to add custom functions
    return new Proxy(this, handler);
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

  static rules = {};
  static options = {};
}

export default Model;
