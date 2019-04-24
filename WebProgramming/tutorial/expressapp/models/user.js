var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt =require('bcrypt');


var schema=new Schema({
    email:{type:String ,require:true},
    username:{type:String ,require:true},
    password:{type:String ,require:true},
    creation_dt:{type:Date ,require:true},
    filepic:{type:String ,require:true},
});
schema.statics.hashPassword =function hashPassword(password)
{
    return bcrypt.hashSync(password,10);

}
schema.methods.isValid=function(hashedpasssword){
    return bcrypt.compareSync(hashedpasssword,this.password);

}
module.exports=mongoose.model('User',schema)