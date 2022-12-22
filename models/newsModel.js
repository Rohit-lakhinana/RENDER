var mongoose = require('mongoose');
 
var imageSchema = new mongoose.Schema({
    hline:String,
    state: String,
    desc: String,
    dist: String,
    pincode: Number,
    img:
    {
        //data type for the image is a Buffer which allows us to store
        //our image as data in the form of arrays.
        data: Buffer,
        contentType: String
    }
});
 
//Images is a collection which has a schema imageSchema
 
module.exports = new mongoose.model('images', imageSchema);