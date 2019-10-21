const router = require('express').Router()
const { validateSignUpStudent, valitePhoneNumber, validateSigninStudent, validateVerifyStudent } = require('qurba-package')
const { authHandelerSignUp, authHandelerSignIn, authHandelerVerify } = require('../handelers')
const passport = require('passport')

/* 
body: {
  username: String required,
  email: String, valid email required, 
  mobile: String, valid mobile required,
  password: String, required
}

returns: username of created student

after success, email will be sent to entered email contains verification link, user will not be able to login untill he is verified
*/

router.post('/signup', async (req, res) => {
    try {
        let { value, error } = validateSignUpStudent(req.body) //validates user entry, hapi/joi used in validation, el code fe l package XD
        if (error) throw new Error(error)
        res.json({ username: await authHandelerSignUp(value, req.get('host')) })
    } catch (error) {
        res.sendStatus(400)
    }
})

/* 
user must be verified before he can login, verify through the mail that will be sent!

body: {
  username: String required,
  password: String required
}

returns: success message, and TOKEN! 
*/

router.post('/signin', async (req, res) => {
    try {
        let { value, error } = validateSigninStudent(req.body)
        if (error) throw new Error(error)
        let isMobile = valitePhoneNumber(value.id)
        let { token, status, message } = await authHandelerSignIn(isMobile, value)
        !token ? res.status(status).end(message) : res.status(status).json({ message, token })
    } catch (error) {
        res.sendStatus(500)
    }
})

/* 
API used to authenticate the token

passport is passed as a middleware to handle the token authentication, and returns 401 if not authorized

returns: user object
*/

router.post('/authenticate', passport.authenticate('jwt', { session: false }), (req, res) => res.json({ user: req.user }))

/* 
API used to verify the link sent to user mail

student will be marked verfied and will be able to login

returns: success if verified
*/

router.get('/verify', async (req, res) => {
    try {
        let { error, value } = validateVerifyStudent(req.query)
        if (error)
            throw new Error(error)
        let { status, message } = await authHandelerVerify(value)
        res.status(status).end(message)
    } catch (error) { res.sendStatus(400) }
})

module.exports = router