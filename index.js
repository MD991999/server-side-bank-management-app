// import express in index.js file
const express = require('express')

// import logic.js
const jwt=require('jsonwebtoken')
const logic = require('./services/logic')

// import cors in index.js file
const cors = require('cors')
const { json } = require('express')

// create  a server application  using express in index.js
const server = express()

// using cors specify the origin to serve app that should share data
server.use(cors({
    origin: 'http://localhost:4200'
}))

// use json parser in server application

server.use(express.json())

// set up port number for server app
server.listen(3000, () => {
    console.log('Bank server is listening at port number 3000');
})

// 


// BANK SERVER API
// http://localhost:3000/

// token verification middleware
const jwtmiddleware=(req,res,next)=>{
    console.log('Router specific middleware');
    // get token from request headers
    const token=req.headers['verify-token']
try{
    // verify token
    const data=jwt.verify(token,"supersecretkey123")
    console.log(data);
    req.currentacno=data.loginacno
    // to resolve user request
next()
}
catch{
    res.status(401).json({message:"Please Login"})
}
}






// register api - http request post(server url,body)
// http://localhost:3000/register


server.post('/register', (req, res) => {
    console.log("Inside register api");
    console.log(req.body);

    // get acno ,uname,and pswd from request body
    logic.register(req.body.acno, req.body.uname, req.body.pswd)
        .then((result) => {
            // send result to client
            res.status(result.statuscode).json(result)
        })
})

// login api - 
server.post('/login', (req, res) => {
    console.log('inside login api');
    console.log(req.body);
    // get acno and pswd from req
    // call login method in login.js
    logic.login(req.body.acno, req.body.pswd)
        .then((result) => {
            // send response to client
            res.status(result.statuscode).json(result)
        })
})

// login api - 
server.get('/getbalance/:acno',jwtmiddleware, (req, res) => {
    console.log('inside gebalance api');
    console.log(req.params);
    // get acno and pswd from req
    // call login method in login.js
    logic.getbalance(req.params.acno)
        .then((result) => {
            // send response to client
            res.status(result.statuscode).json(result)
        })
})

// fund tranfer api-jwt middleware router specific middleware
server.post('/fund-transfer',jwtmiddleware,(req,res)=>{
    console.log('Inside fund transfer api');
    console.log(req.body);
// get acno and pswd from request
// call fundtransfer methd from logic.js
logic.fundtransfer(req.currentacno,req.body.pswd,req.body.toacno,req.body.amount)
.then((result)=>{
    // send result to client
    res.status(result.statuscode).json(result)
})
})

// transaction  history api
server.get('/transactions',jwtmiddleware,(req,res)=>{
    console.log('Inside transaction history api');
    // call transactionhistory function defined inside the logic.js
    logic.transactionhistory(req.currentacno)
    .then((result)=>{
        res.status(result.statuscode).json(result)
    })
})


// request delete account from database
server.delete('/delete-acno',jwtmiddleware,(req,res)=>{
    console.log('Inside delete api');
    logic.deleteacno(req.currentacno)
    .then((result)=>{
        res.status(result.statuscode).json(result)
  
    })
})  