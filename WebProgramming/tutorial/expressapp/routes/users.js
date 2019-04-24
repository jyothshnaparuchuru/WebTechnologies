var express = require('express');
var router = express.Router();

var passport=require('passport');
var session=require('express-session');
var User=require('../models/user')
var Products=require('../models/Prod')
var passport=require('passport')
var multer = require('multer');
var Cart=require('../models/Cart')
var cartdatabase=require('../models/cartitems');
var ee;

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('in storage');
    const isValid = MIME_TYPE_MAP[file.mimetype];
    console.log('in storage' + file);
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "public/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});
var sess;

var upload = multer({storage: storage});
/* GET users listing. */
router.get('/', function(req, res, next) {
   res.send('respond with a resource');
sess=req.session;
sess.email;
sess.username;
sess.cart;


 });
router.post('/register',function(req,res,next){
  console.log('in users registter')
  console.log("in register"+req.body.password);
addToDB(req,res);
return res.status(200).json({msg:"hello"});
});

router.post('/addprod',upload.single('image'),(req, res, next) => {
  console.log('im in addprod')
  const url = req.protocol + "://" + req.get("host");
  var a= url + "/images/" + req.file.filename;
  console.log(a)
addToprodDB(req,res,a);

var products=new Products({
  name:req.body.name,
  description:req.body.description,
  price:(req.body.price),
  offers:req.body.offers,
  availability:req.body.availability,
  rr:req.body.rr,
  filepic:a
});
console.log("jkhjkhj"+products);

return res.status(200).json({msg:"hello"});
});

async function addToprodDB(req,res,a){
  var products=new Products({
    name:req.body.name,
    description:req.body.description,
    price:(req.body.price),
    offers:req.body.offers,
    availability:req.body.availability,
    rr:req.body.rr,
    filepic:a
  });
  console.log(products)
  try{
    console.log('in adding to database pod')
    console.log(products.body)
    doc1=await products.save();
    console.log(doc1);
    return res.status(201).json(doc1);
  }
  catch(err)
  {
  return releaseEvents.status(501).json(err);
  }
  }


async function addToDB(req,res){
var user=new User({
  email:req.body.email,
  username:req.body.username,
  password:User.hashPassword(req.body.password),
  creation_dt:Date.now(),
  filepic:req.body.filepic
});
try{
  doc=await user.save();
  console.log(doc);
  return res.status(201).json(doc);
}
catch(err)
{
return releaseEvents.status(501).json(err);
}
}
router.post('/login',function(req,res,next){
  console.log('in users');
this.ee=req.body.email
  sess=req.session;
  sess.email=req.body.email;
  sess.username=req.body.username;
  //window.localStorage.setItem('mailid', req.body.email);
  passport.authenticate('local', function(err, user, info) {
    if (err) {  console.log("user error----");return res.status(501).json(err); }
    if (!user) { console.log("not user ----");
    return res.status(501).json(info); }
    req.logIn(user, function(err) {
      console.log("im here")
      if (err) { 
        console.log("user error");
        return res.status(501).json(err); }
      return res.status(200).json({message:'Login Sucess'});
    });
  })(req, res, next);
});
router.get('/user',isValidUser,function(req,res,next){
  return res.status(200).json(req.user);
});

router.get('/logout',isValidUser, function(req,res,next){
  req.logout();
  return res.status(200).json({message:'Logout Success'});
})

function isValidUser(req,res,next){
  if(req.isAuthenticated()) next();
  else return res.status(401).json({message:'Unauthorized Request'});
}

router.get('/getprod',function(req,res,next){

  Products.find({},(err,prods)=>{
    if(err)
        res.status(500).json({errmsg:err});
    res.status(200).json({msg:prods});
});

 } );


 router.post('/addtocart',function(req,res,next){
  console.log('==in users add to cart');
 
 console.log(req.body.price+".....name."+typeof(req.body.price)+"mmmmmmmmmmm"+typeof(parseInt(req.body.price)))
 console.log('----body---'+JSON.stringify(req.body))

 someFunction(req.body.user,req.body.id,req.body.name,req.body.image,req.body.price) ;

 function someFunction(us,id,name,image,price) {
  cartdatabase.findOne({ User: us }, function(err, document) {
    if (document) {
      i=0;
      this.totalQuantity++;
      this.totalPrice=this.totalPrice+parseInt(price);
      // if(!req.body.id){
        document.prodata.push({
          id: id,
          name: name,
          image: image,
          price: parseInt(price),
          quantity: 1,
          totalPrice:parseInt(price),
  
        })
      // }
      // else{  
      //   console.log('in else id')
       
      //   document.prodata.push({
      //     id: id,
      //     name: name,
      //     image: image,
      //     price: parseInt(price),
      //     quantity: 1,
  
      //   })}
    
    
      
      document.save(function(err) {
        err != null ? console.log(err+"nnnnnnnnnn") : console.log('Data updated')
      })
      
    }
    else{
      console.log('in else')
var cd=new cartdatabase({
  totalQuantity:1,
  totalPrice:parseInt(price),
  User:us,
  prodata:[{id: id,
    name: name,
    image: image,
    price: parseInt(price),
    quantity: 1,
    totalPrice:parseInt(price),


  }]


})
      cd.save()
    }
  })
}

 
return res.status(200).json({msg:"added sucessfully"});
});

router.get('/getcartitems',function(req,res,next){

  cartdatabase.find({},(err,cart)=>{
    if(err)
        res.status(500).json({errmsg:err});
    res.status(200).json({msg:cart});
});

 } );

 router.put('/update',(req,res,next)=>{

  cartdatabase.findById(req.body._id,(err,cart) =>
  {
      if(err)
          res.status(500).json({errmsg:err});
      cart.name=req.body.name;
      cart.capital=req.body.capital;
      cart.save((err,country)=>
      {
          //res.status(500).json({errmsg:err});
          res.status(200).json({msg:cart});
      });

  });
  //res.status(200).json({msg:'put request is working'});
});



router.put('/updatecart',function(req,res,next){
  console.log('==in users update  cart');
 
 someFunction(req.body) ;

 function someFunction(updateddata) {
   console.log('3333333'+JSON.stringify(updateddata))

   var cc=new cartdatabase(updateddata);
  cartdatabase.update( {_id:updateddata._id} ,updateddata,function(err, document){
    if(document)
    {
   
    cc.save((err,document)=>
    {
        
        console.log('im here')
    });
    }
    else{
      console.log('in else')
    }

  }
  )
}

return res.status(200).json({msg:"updated sucessfully"});
});

router.delete('/deleting/:id',(req,res,next)=>{
  console.log("id is"+req.params.id)
  cartdatabase.findByIdAndDelete(req.params.id,(err,doc)=>{
      if(err)
         {
           console.log('im in del if')
         }
  })
  res.status(200).json({msg:'delette request is working'});
});
 
module.exports = router;
