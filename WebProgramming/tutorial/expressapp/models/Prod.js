var mongoose=require('mongoose');
var Schema=mongoose.Schema;



var schema=new Schema({
    name:{type:String ,require:true},
    description:{type:String ,require:true},
    price:{type:String ,require:true},
    offers:{type:String ,require:true},
    availability:{type:String ,require:true},
    rr:{type:String ,require:true},
    filepic:{type:String ,require:true},
});

module.exports=mongoose.model('prod',schema)