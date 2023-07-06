// import mongoose in db.js

const mongoose = require('mongoose')

// defining the connection string

mongoose.connect('mongodb://localhost:27017/bank')

// create a collection/model

const User = mongoose.model('User',{
    acno:Number,
    username:String,
    password:String,
    balance:Number,
    transactions:[]
    // a person has more than transactions
    
})

// export the model

module.exports = {
    User
}