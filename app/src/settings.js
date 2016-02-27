const fs = require('fs');
const path = require('path');
const remote = require('electron').remote;

const DEFAULTS = {
  'database-path': ''
};

export class Settings {
  constructor() {
    this.values = {};

    this._path = path.join(
      remote.require('app').getPath('userData'),
      'settings.json'
    );
  }

  getValue(name) {
    let val = this.values[name];

    if (val === undefined) {
      val = DEFAULTS[name];

      if (val === undefined) {
        throw new Error(`'${name}' setting doesn't exist!`);
      }
    }

    return val;
  }

  setValue(name, newValue) {
    if (DEFAULTS[name] === undefined) {
      throw new Error(`Cannot set '${name}' - this setting doesn't exist!`);
    }

    this.values[name] = newValue;
  }

  save() {
    fs.writeFileSync(this._path, JSON.stringify(this.values, null, 2));
    console.info('Settings saved');
  }

  load() {
    try {
      this.values = JSON.parse(fs.readFileSync(this._path));
      console.info('Settings loaded');
    } catch (err) {
      // If file doesn't exist - create one using default settings
      this.resetToDefaults();
      this.save();

      console.info('Created default settings');
    }
  }

  resetToDefaults() {
    this.values = {};

    for (let k in DEFAULTS) {
      this.values[k] = DEFAULTS[k];
    }
  }
}
