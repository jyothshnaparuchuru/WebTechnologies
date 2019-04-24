//var cartitems=require('../models/Cart');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var prod=require('../models/Prod')

var schema = new Schema({
    User:{type:String},
        prodata: [{
            id: String,
            name: String,
            image: String,
            price: Number,
            quantity: Number,
            totalPrice: Number,
        }],
	
	totalQuantity:{type:Number},
    totalPrice:{type:Number},
    
})
module.exports = mongoose.model('c',schema);