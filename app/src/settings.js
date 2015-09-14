var fs = require('fs');
var events = require('events');

function Settings(path) {
  this.filePath = path;
  this.values = {};
  this.events = new events.EventEmitter();
}

Settings.defaults = {
  'window-width': 1280,
  'window-height': 854,
  port: 5470,
  'database-path': ''
};

Settings.prototype.getProperty = function(name) {
  return this.values[name];
};

Settings.prototype.setProperty = function(name, value) {
  this.values[name] = value;

  this.events.emit('settings-change');
};

Settings.prototype.loadFromFile = function() {
  try {
    this.values = JSON.parse(fs.readFileSync(this.filePath));

    // After reading file, check if all of the properties in default settings
    // were set in the file we've read.
    // If updated version of this app introduced new property that was not set
    // in that file, we will create it and set it to the default value.
    for (var k in Settings.defaults) {
      if (this.values[k] === undefined) {
        this.values[k] = Settings.defaults[k];
      }
    }

  } catch (err) {
    // If file doesn't exist - create default settings
    this.resetToDefault();

    this.saveToFile();
  }
};

Settings.prototype.resetToDefault = function() {
  this.values = {};

  for (var k in Settings.defaults) {
    this.values[k] = Settings.defaults[k];
  }
};

Settings.prototype.saveToFile = function() {
  fs.writeFileSync(this.filePath, JSON.stringify(this.values, null, 2));
};

module.exports = Settings;
