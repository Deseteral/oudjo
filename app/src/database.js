const fs = require('fs');
const path = require('path');

export class Database {
  constructor(rootPath) {
    this.paths = {
      root: rootPath,
      appDir: path.join(rootPath, '.oudjo')
    };
  }

  load() {
    // Create database directory if it doesn't exist
    try {
      fs.statSync(this.paths.appDir);
    } catch (err) {
      fs.mkdirSync(this.paths.appDir);
      console.info('Created database directory (.oudjo)');
    }

    console.info('Database loaded');
  }
}
