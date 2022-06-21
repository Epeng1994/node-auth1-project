const db = require('../../data/db-config')
/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
async function restricted(req,res,next) {
  if(req.session.user){
    next()
  }else{
    return next({status:401, "message": "You shall not pass!"})
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res,next) {
  const {username} = req.body
  const check = await db('users').where('username', username)
  check.length > 0 ? next({status:422, message:"Username taken"}) : next()
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req,res,next) {
  const {username} = req.body
  const check = await db('users').where({username}).first()
  if(check) {
    req.user = check
    next()
  }else{
    next({status:401,message:"Invalid credentials"})
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  const{password} = req.body
  if(password === undefined || password.trim().length <= 3 || password.trim() === ''){
    next({status:422, message:"Password must be longer than 3 chars"})
    return
  }else{
    next()
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules


module.exports = {
  restricted, checkUsernameExists, checkUsernameFree, checkPasswordLength
}