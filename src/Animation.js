import React from 'react';

export default class Animation {

  get length() {
    return this._keys.length;
  }

  get config() {
    return this._config;
  }

  constructor(values, config) {
    this._callbacks = new Map();
    this._keys = [];
    this._values = {};
    this._config = {
      initialVelocity: 0,
      friction: 26,
      mass: 1,
      precision: 0.01,
      tension: 170,
      ...config
    };

    for (let val in values) {
      this._values[val] = {
        done: false,
        toValue: values[val],
        lastPosition: values[val],
        lastTime: void 0,
        lastVelocity: void 0,
      };

      this._keys.push(val);
    }
  }

  removeCallbackWithKey(key) {
    this._callbacks.delete(key);
  }

  addCallbackWithKey(key, fn) {
    this._callbacks.set(key, fn);
  }

  updateValue() {
    for (let [key, cb] of this._callbacks) {
      cb(this._values);
    }
  }

  set(obj) {
    for (let val in obj) {
      if(!this._values.hasOwnProperty(val) || this._values[val] === obj[val]) {
        continue;
      }

      this._values[val] = {
        ...this._values[val],
        done: false,
        lastVelocity: void 0,
        toValue: obj[val]
      };
    }
  }

  get(prop) {
      if(!this._values.hasOwnProperty(prop)) {
        return null;
      }

      return this._values[prop].lastPosition;
  }

  pause() {
    for (let prop in this._values) {
      this._values[prop] = {
        ...this._values[prop],
        done: true
      };
    }
  }

  resume() {
    for (let prop in this._values) {
      this._values[prop] = {
        ...this._values[prop],
        done: false
      };
    }
  }

  getValues(i) {
    return this._values[this._keys[i]];
  }
}
