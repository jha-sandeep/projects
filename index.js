const express = require('express');
const cors = require('cors')
const connection = require('./mydb/connection.js')
const User = require('./mydb/User.js')
const Product = require('./mydb/products.js')
const app = express()

app.use(express.json())
app.use(cors())

app.post('/register',async (req,res)=>{

   const user = new User(req.body)
   const result = await user.save()
   res.send(result)
})

app.post('/login',async(req,res)=>{
   if(req.body.email&&req.body.password){
      let user = await User.findOne(req.body)
    if(user){
      res.send(user)
    }else{
      res.send('no user found')
    }


   }else{
        res.send('no user found')
   }
})


app.post('/addproducts',async(req,res)=>{
   let product= new Product(req.body)
   let result = await product.save()
   res.send(result)

})

app.get('/products',async (req,res)=>{
    const products = await Product.find()
    if(products.length>0){
      res.send(products)
    }else{
       res.send({msg:"No product found"})
    }

})

app.delete('/product/:id',async(req,res)=>{
   const products = await Product.deleteOne({_id:req.params.id})
   res.send(products)
})

app.get('/product/:id',async(req,res)=>{
   const result = await Product.findOne({_id:req.params.id})
   if(result){
      res.send(result)
   } else{
      res.send({msg:'No record found'})
   }
})

app.put('/product/:id',async(req,res)=>{
   const result = await Product.updateOne(
      {_id:req.params.id},{$set:req.body}
   )
   res.send(result)
})

app.get('/search/:key',async(req,res)=>{
   const result = await Product.find({
      "$or" :[
           {firstname:{$regex:req.params.key,'$options': 'i'}},
           {lastname:{$regex:req.params.key,'$options': 'i'}},
           {phone:{$regex:req.params.key}},
           {address:{$regex:req.params.key,'$options': 'i'}}
       

      ]
   })
       
res.send(result)
})  

app.listen(8080)

