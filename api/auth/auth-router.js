// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const {checkUsernameExists, checkUsernameFree, checkPasswordLength} = require('./auth-middleware')
const {add} = require('../users/users-model')
const express = require('express')
const router = express.Router() 
const bcrypt = require('bcryptjs')

router.use(express.json())


/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */
router.post('/register',checkUsernameFree,checkPasswordLength,(req,res,next)=>{
  const {username, password} = req.body
  const hash = bcrypt.hashSync(password, 12)
  add({username:username, password:hash})
    .then(result=>res.json(result))
    .catch(next)
})

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
*/

router.post('/login', checkUsernameExists, (req,res,next)=>{
  const {username, password} = req.body
  if(bcrypt.compareSync(password, req.user.password) == false){
    next({status:401,message:"Invalid credentials"})
    return
  }else{
    req.session.user = req.user
    console.log(req.session)
    res.json({"message": `Welcome ${username}!`})
  }
})

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

router.get('/logout', (req,res,next)=>{
  if(req.session.user == null){
    return res.json({"message": "no session"})
  }else if(req.session.user){
    req.session.destroy(err=>{
      err ? next({status:500,message:'Error logging out'}) : res.json({"message": "logged out"})
    })
  }
})



// Don't forget to add the router to the `exports` object so it can be required in other modules


module.exports = router