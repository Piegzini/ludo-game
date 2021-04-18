const { resolve } = require('path');
const Datastore = require('nedb');

class Database {
  constructor() {
    this.storage = new Datastore({
      filename: resolve('database', 'games-data-base.db'),
      autoload: true,
    });
  }
}

const database = new Database();
exports.module = database;
