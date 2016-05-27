'use strict';

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PostSchema = new Schema({

    tenant: { type: Schema.Types.ObjectId, required: true },

    description: { type: String, required: true },

    picture: { type: String, required: true },

    created: { type: Date, required: true },

    ownerId: { type: Schema.Types.ObjectId, required: true },

    stateId: { type: Schema.Types.ObjectId, required: true },

    tags: { type: [String] }
});

var PostPictureSchema = new Schema({

    data: { type: String, required: true }
});

var TenantSchema = new Schema({
    ownerId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true }
});

var StateSchema = new Schema({
  name: { type: String, required: true }
});

var UserSchema = new Schema({

    email: { type: [String] },
    firstName: { type: String },
    lastName: { type: String },

    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },

    posts: { type: [{
        postId: { type: Schema.Types.ObjectId, required: true }
    }] }
});

exports.postSchema = PostSchema;
exports.stateSchema = StateSchema;
exports.postPictureSchema = PostPictureSchema;
exports.tenantSchema = TenantSchema;
exports.userSchema = UserSchema;
exports.subscriptionSchema = SubscriptionSchema;
