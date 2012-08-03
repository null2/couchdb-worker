/*
 * CouchDB Worker
 *
 * Mocha tests for Worker module.
 *
 * Author: Johannes J. Schmidt
 * (c) null2 GmbH, 2012
 * MIT Licensed
 */

var assert = require("assert");
var Worker = require("./../lib/worker");

describe("CouchDBWorker", function() {
  var options = {
    name: 'test-worker',
    server: 'http://localhost:5984',
    processor: {
      check: function(doc) {
        return true;
      },
      process: function(doc, done) {
        // do something with the doc
        var output = {
          foo: 'bar'
        };
        done(output);
      }
    }
  };
  var db = '_users';

  var worker = new Worker(options, db);

  describe("_onchanges", function() {
    it("should be a function", function() {
      assert.equal('function', typeof worker._onchanges);
    });
  });

  describe("_nextChange", function() {
    it("should be a function", function() {
      assert.equal('function', typeof worker._nextChange);
    });
  });

  describe("_check", function() {
    it("should be a function", function() {
      assert.equal('function', typeof worker._check);
    });

    it("should return false if no config present", function() {
      assert(!worker._check());
    });

    it("should return processor.check when config is present", function() {
      var check = "mycheckreturnvalue";

      worker.config = {};

      assert(worker._check({}));

      var oldcheck = worker.processor.check;
      worker.processor.check = function() {
        return check;
      };

      assert.equal(check, worker._check({}));

      // reset
      worker.processor.check = oldcheck;
      delete worker.config;
    });

    it("should return false if status set", function() {
      worker.config = {};

      assert(!worker._check({
        worker_status: {
          'test-worker': {
            status: 'completed'
          }
        }
      }));

      // reset
      delete worker.config;
    });
  });

  describe("_process", function() {
    it("should be a function", function() {
      assert.equal('function', typeof worker._process);
    });
  });

  describe("_setWorkerStatus", function() {
    it("should be a function", function() {
      assert.equal('function', typeof worker._setWorkerStatus);
    });
    it("should insert status", function() {
      var status = 'mystatus',
          error = 'myerror',
          doc = {};

      worker._setWorkerStatus(doc, status, error);

      assert.equal('object', typeof doc.worker_status);
      assert.equal('object', typeof doc.worker_status[worker.name]);
      assert.equal(status, doc.worker_status[worker.name].status);
      assert.equal(error, doc.worker_status[worker.name].error);
    });
    it("should not insert error if error is null", function() {
      var doc = {};

      worker._setWorkerStatus(doc, 'mystatus', null);

      assert(!('error' in doc.worker_status[worker.name]));
    });
  });

  describe("_processDone", function() {
    it("should be a function", function() {
      assert.equal('function', typeof worker._processDone);
    });
  });

  describe("_commit", function() {
    it("should be a function", function() {
      assert.equal('function', typeof worker._commit);
    });
  });

  describe("_reset", function() {
    it("should be a function", function() {
      assert.equal('function', typeof worker._reset);
    });
  });

  describe("_mergeResult", function() {
    it("should be a function", function() {
      assert.equal('function', typeof worker._mergeResult);
    });
    it("should merge attributes", function() {
      var doc = {},
          attributes = {
            foo: 'bar'
          };

      worker._mergeResult(doc, attributes);

      assert.equal(doc.foo, attributes.foo);
    });
    it("should merge nested attributes", function() {
      var doc = {
            inception: {
              deep: 'one'
            }
          },
          attributes = {
            inception: {
              foo: 'bar'
            }
          };

      worker._mergeResult(doc, attributes);

      assert.equal(doc.inception.foo, attributes.inception.foo);
    });
  });

  describe("_changesDone", function() {
    it("should be a function", function() {
      assert.equal('function', typeof worker._changesDone);
    });
  });

  describe("_checkResponse", function() {
    it("should be a function", function() {
      assert.equal('function', typeof worker._checkResponse);
    });
    it("should return null if there are no errors", function() {
      assert.equal(null, worker._checkResponse(null, { statusCode: 200 }, {}));
    });
    it("should return error", function() {
      var error = { error: 'myerror' };

      assert.equal('object', typeof worker._checkResponse(error));
      assert.equal(error, worker._checkResponse(error).error);
    });
  });

  describe("_log", function() {
    it("should be a function", function() {
      assert.equal('function', typeof worker._log);
    });
  });
});