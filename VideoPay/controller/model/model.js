module.exports = (function () {
    const mongoose = require('mongoose');

    'use strict';

    var mgQuery = function( schema ) {
            try {
                this.schema = new mongoose.Schema(schema);
            } catch(err) {
                console.log('Error to construct the schema: ', schema, err);
            }

            return this;
        };

    mgQuery.version = "1.0.0";

    mgQuery.query = function(filters, callback) {
        if (this.schema) {
            return this.schema.find(filters).exec(callback);
        }

        return null;
    }

    mgQuery.query_one = mgQuery.query;

    mgQuery.save = function() {
        if (this.schema.isNew) {
            this.schema.meta.createdAt = Date.now();
            this.schema.meta.updateAt = Date.now();
        } else {
            this.schema.meta.updateAt = Date.now();
        }

        this.schema.pre('save', function() {
            return doStuff().
                then(() => doMoreStuff());
        });
    }

    return mgQuery;
})();