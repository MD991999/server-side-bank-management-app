//1.  get acno,uname,pswd  from request body

// import model/collection from db.js
const db = require('./db')

// import jsonwebtoken
const jwt = require('jsonwebtoken')


//defining  logic to resolve register

const register = (acno, username, password) => {
    console.log('Inside register logic');
    // 2.check acno is existing in user collection of bank data base
    // asynchronous function call-promise()
    return db.User.findOne({
        acno
    }).then((result) => {
        console.log(result);
        // 2.1.if existing,
        if (result) {
            // send response as "user already exist" to client
            return {
                statuscode: 401,
                message: "User already exists..."
            }
        }
        // 2.2.if acno is not existing,create acno in bank database with details as its uname and password,send response as "register successfully" to client


        // normally while creating new data what we do is we use the property called insertOne in mongodb.But here what we are gonna do is we will specify a model for the incomming data,ie we will say that the incoming data is of a particular model,we specify it as an object.

        else {
            const newuser = new db.User({
                acno,
                username,
                password,
                balance: 1000,
                transactions: []
            })
            // to store data in mongodb
            newuser.save()
            // send response to index.js
            return {
                statuscode: 200,
                message: "Register Successfully"
            }
        }

    })
}

// defining logic to resolve login request

const login = (acno, pswd) => {
    // to find acno and pswd is available in db
    return db.User.findOne({
        acno,
        password: pswd
    }).then((result) => {
        // user exist
        if (result) {
            // generate token
            const token = jwt.sign({
                loginacno: acno
            }, "supersecretkey123")
            return {
                statuscode: 200,
                message: 'login succesfull',
                // sending login username to client 
                currentusername: result.username,
                // sending logined account number to client
                currentacno: acno,
                // sending token to frontend
                token
            }
        }
        else {
            return {
                statuscode: 404,
                message: 'Invalid acno/password!!!'
            }
        }
    })
}

// to get balance
const getbalance = (acno) => {
    // check acno is available in user collection 
    return db.User.findOne({
        acno
    }).then(
        // user exist
        (result) => {
            if (result) {
                // acno is present
                // send balance to front end
                return {
                    statuscode: 200,
                    balance: result.balance
                }
            }
            else {
                // send balance to frontend
                return {
                    statuscode: 401,
                    message: "Invalid Account number"
                }
            }
        }
    )
}

// fund transfer

const fundtransfer = (fromacno, pswd, toacno, amt) => {
    let amount = parseInt(amt)
    return db.User.findOne({
        acno: fromacno,
        password: pswd
    }).then((result) => {
        if (result) {
            // denied operation for self account transfer
            if (fromacno == toacno) {
                return {
                    statuscode: 404,
                    message: "Permission denied!! /n you can continue after 2s"
                }
            }
            // from acno verified
            return db.User.findOne({
                acno: toacno
            })
                .then((data) => {
                    if (data) {
                        // toacno verified
                        if (result.balance >= amount) {
                            // sufficient balance
                            // debit amount fromaacno
                            result.balance -= amount
                            result.transactions.push({
                                type: 'DEBIT',
                                fromacno,
                                toacno,
                                amount
                            })
                            result.save()
                            // credit amount toacno
                            data.balance += amount
                            data.transactions.push({
                                type: 'CREDIT',
                                fromacno,
                                toacno,
                                amount
                            })
                            data.save()
                            return {
                                statuscode: 200,
                                message: "Fund transfer successfull /n you can continue after 2s"
                            }
                        }
                        else {
                            return {
                                statuscode: 404,
                                message: 'Insufficient balance /n you can continue after 2s'
                            }
                        }
                    }
                    else {
                        return {
                            statuscode: 404,
                            message: 'Invalid credit credentials /n you can continue after 2s'
                        }
                        // alert('Invalid credit credentials')
                    }
                })
        }
        else {
            return {
                statuscode: 404,
                message: 'Invalid debit credentials /n you can continue after 2s'
            }
            // alert('Invalid debit credentials')
        }
    })
}


// transaction history
const transactionhistory=(acno)=>{
// check acno is in db
return db.User.findOne({
  acno  
})
.then((result)=>{
    if(result){
    // acno is present in db-result is entire details of acno
return{
    statuscode:200,
    transactions:result.transactions
}
    }
    else{
        // it acno is not present in dbnjj
        return {
            statuscode: 404,
            message: 'Invalid debit credentials /n you can continue after 2s'
        }
    }
})
}


// logic to delete an account

const deleteacno=(acno)=>{
// delete acno from db
return db.User.deleteOne({
    acno
})
.then((result)=>{
    if(result){
        // acno removed successfully
        return{
            statuscode:200,
            message:"Account deleted successfully from our database"
        }
    }
    else{
        return{
            statuscode:401,
            message:"Invalid Credentials"
        }
    }
})
}








// export
module.exports = {
    register,
    login,
    getbalance,
    fundtransfer,
    transactionhistory,
    deleteacno
}