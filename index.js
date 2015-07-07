var low = require('lowdb');
var uuid = require('uuid');
var Promise = require('bluebird');

function LowBastard(filename) {
  this.db = low(filename);
}

LowBastard.prototype.findAll = function(tableName, user, options) {
  return new Promise(function(resolve, reject) {
    if(this.db.object[tableName]) {
      resolve(this.db(tableName).take(5));
    } else {
      resolve([]);
    }
  }.bind(this));
}

LowBastard.prototype.findOne = function(tableName, id, user) {
  return new Promise(function(resolve, reject) {
    if(this.db.object[tableName]) {
      var where = {_id: id};

      if(tableName !== 'app_users') {
        where._created_by_id = user._id;
      }

      var record = this.db(tableName).findWhere(where);
      if(record) {
        resolve(record);
      } else {
        reject(new Error('Row with id: ' + id + ' not found in table "' + tableName + '"'));
      }
    } else {
      reject(new Error('Row with id: ' + id + ' not found in table "' + tableName + '"'));
    }
  }.bind(this));
}

LowBastard.prototype.find = function(tableName, user, filter, sort) {
  return new Promise(function(resolve, reject) {
    if(this.db.object[tableName]) {
      resolve(this.db(table).find(filter));
    } else {
      resolve([]);
    }
  }.bind(this));
}

LowBastard.prototype.insertDocument = function(tableName, user, data) {
  var now = new Date().toJSON();
  data._id = uuid.v4();
  data._created_date = now;
  data._last_updated_date = now;

  if(tableName !== 'app_users') {
    data._created_by_id = user._id;
  }

  return new Promise(function(resolve, reject) {
    this.db(tableName).push(data);
      resolve(data);
  }.bind(this));
}

module.exports = LowBastard;
