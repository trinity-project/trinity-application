module.exports = (function () {
    const mgQuery = require('./model');
    const mongoose = require('mongoose');

    'use strict';

    var channelSchema = mgQuery({
        name: {
            type: String,
            unique: true
        },
        password: {
            type: String
        },
        asset: {
            tnc: {
                deposit: {type: Number, default: demo_deposit},
                address: {type: String},
                private_key: {type: String},
                public_key: {type: String}
            },
            neo:{
                deposit: {type: Number, default: demo_deposit},
                address: {type: String},
                private_key: {type: String},
                public_key: {type: String}
            },
            neo_gas:{
                deposit: {type: Number, default: demo_deposit},
                address: {type: String},
                private_key: {type: String},
                public_key: {type: String}
            }
        },
        channel: {
            tnc: {
                name: {type: String},
                state: {type: String}
            },
            neo: {
                name: {type: String},
                state: {type: String}
            },
            neo_gas: {
                name: {type: String},
                state: {type: String}
            }
        },
        meta: {
            createAt: {
                type: Date,
                default: Date.now()
            },
            updateAt: {
                type: Date,
                default: Date.now()
            }
        }
    });

    userSchema.schema.methods = {
        comparePassword: function(password, callback) {
            if (this.password === password){
                return callback(null, true);
            }
            return callback('Mismatched password');
        }
    }

    return mongoose.model('user', userSchema.schema);
})();
