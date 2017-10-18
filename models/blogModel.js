var mongoose    = require('mongoose'),
    config      = require('../config/config'),
    db          = mongoose.connection,
    Schema      = mongoose.Schema;


mongoose.connect(config.db); 


  
var blogSchema = new Schema({
title: String,
image: String,
body: String,
author: {
   id: {
       type: Schema.ObjectId,
       ref: 'User'
       },
   username: String
},
created: {
   type: Date, 
   required: true,
   default: Date.now
   
}
});

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', (callback) => {
    console.log("snip snap db up and runnin'");
});

module.exports = mongoose.model('Blog', blogSchema);