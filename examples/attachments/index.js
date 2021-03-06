/*
 * CouchDB Worker Mime Example
 * 
 * example worker that checks every attachment
 * and inserts the mime type detected by file command.
 *
 * Author: Johannes J. Schmidt
 * (c) null2 GmbH, 2012
 * MIT Licensed
 */

var spawn = require('child_process').spawn;
var request = require("request");
var Worker = require("couchdb-worker").attachments;

var config = {
  name: 'mime',
  server: process.env.COUCHDB_SERVER || "http://127.0.0.1:5984",
  processor: {
    process: function(doc, name, done) {
      var mimes = doc.mimes || {},
          url = this.server
            + '/' + encodeURIComponent(this.db)
            + '/' + encodeURIComponent(doc._id)
            + '/' + encodeURIComponent(name),
          file = spawn('file', ['--mime', '--brief', '-']);

      file.stdout.on('data', function(data) {
        mimes[name] = data.toString();
      });

      file.on('exit', function(code) {
        done(null, { mimes: mimes })
      });

      request(url).pipe(file.stdin);
    }
  }
};

if (process.env.COUCH_DB) {
  new Worker(config, process.env.COUCH_DB);
} else {
  console.error('I need the environment variable COUCH_DB');
}
