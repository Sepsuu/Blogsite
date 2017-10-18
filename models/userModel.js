var mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema,
    config                  = require('../config/config'),
    db                      = mongoose.connection,
    passportLocalMongoose   = require('passport-local-mongoose');


mongoose.connect(config.db);



var UserSchema = new Schema({
username: String,
password: String
});

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', (callback) => {
    console.log("snap snip db runnin'");
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);