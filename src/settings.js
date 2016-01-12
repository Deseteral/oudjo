const fs = require('fs');
const events = require('events');

export class Settings {
  constructor(path) {
    this.filePath = path;
    this.values = {};
    this.events = new events.EventEmitter();
  }

  getProperty(name) {
    return this.values[name];
  }

  setProperty(name, value) {
    this.values[name] = value;
    this.events.emit('settings-change');
  }

  loadFromFile() {
    try {
      this.values = JSON.parse(fs.readFileSync(this.filePath));

      // After reading file, check if all of the properties in default settings
      // were set in the file we've read.
      // If updated version of this app introduces new property that was not set
      // in that file, we will create it and set it to the default value.
      for (var k in Settings.defaults) {
        if (this.values[k] === undefined) {
          this.values[k] = Settings.defaults[k];
        }
      }

    } catch (err) {
      // If file doesn't exist, set default settings and save them to file
      this.resetToDefault();
      this.saveToFile();
    }
  }

  resetToDefault() {
    this.values = {};

    for (var k in Settings.defaults) {
      this.values[k] = Settings.defaults[k];
    }
  }

  saveToFile() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.values, null, 2));
  }
}

Settings.defaults = {
  'window-width': 1280,
  'window-height': 854,
  port: 5470,
  'database-path': ''
};
