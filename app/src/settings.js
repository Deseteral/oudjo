var fs = require('fs');
var defaults = require('./defaults');

function Settings(path) {
  this.filePath = path;
  this.values = {};
}

Settings.prototype.setProperty = function(name, value) {
  this.values[name] = value;
};

Settings.prototype.getProperty = function(propName) {

  // If requested property is not defined, try to set it to the default one
  if (this.values[propName] === undefined) {

    // If the default value for that property doesn't exist, display an error
    if (defaults[propName] !== undefined) {
      this.values[propName] = defaults[propName];
    } else {
      console.error('There is no setting with name: ' + propName);
    }
  }

  return this.values[propName];
};

Settings.prototype.loadFromFile = function() {
  try {
    this.values = JSON.parse(fs.readFileSync(this.filePath));
  } catch (err) {
    // If file doesn't exist - create default settings
    for (var k in defaults) {
      this.values[k] = defaults[k];
    }

    this.saveToFile();
  }
};

Settings.prototype.saveToFile = function() {
  fs.writeFileSync(this.filePath, JSON.stringify(this.values, null, 2));
};

module.exports = Settings;
