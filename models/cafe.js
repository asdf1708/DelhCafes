const mongoose = require('mongoose');
var cafeSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        username:String
    },
    comment:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'comment'
        }
    ]
});

module.exports = mongoose.model('cafe',cafeSchema);
