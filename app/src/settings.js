const fs = require('fs');
const path = require('path');
const remote = require('remote');

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
