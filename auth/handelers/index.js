const { userModelInsert, userModelSelectUserData, userModelUpdateOperations } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendmail = require('../services/mailSender')


exports.authHandelerSignUp = (student, host) => {
    student.password = bcrypt.hashSync(student.password, bcrypt.genSaltSync())
    return userModelInsert({ one: true, value: student }).then(({ username, email }) => {
        rand = bcrypt.hashSync(username, bcrypt.genSaltSync())
        link = "http://" + host + ":8080" + "/verify?id=" + rand + "&username=" + username
        sendmail(email, "verification", link)
        return username
    })
}

exports.authHandelerSignIn = async (isMobile, info) => {
    let finder = isMobile === true ? { mobile: info.id } : { email: info.id }
    let user = await userModelSelectUserData({ one: true, finder })
    if (user && user.username) {
        return !user.isVerified ? ({ status: 400, message: "please verify first from the mail sent!, ba3to leh ana -.-!" }) : bcrypt.compareSync(info.password, user.password) ?
            ({ status: 200, message: "loggedin", token: jwt.sign({ id: { isMobile, id: info.id } }, process.env.JWT_SECRET) })
            : ({ status: 400, message: "username or password are incorrect" })
    } else return ({ status: 404, message: "username or password are incorrect!" })
}

exports.authHandelerVerify = async ({ username, id }) => {
    let user = await userModelSelectUserData({ one: true, finder: { username } })
    if (user) {
        let check = bcrypt.compareSync(username, id)
        if (check)
            return userModelUpdateOperations({ one: true, finder: { username }, updates: { $set: { isVerified: true } } }).then(({ nModified }) =>
                nModified > 0 ? ({ status: 200, message: `${username} now is verified` }) : ({ status: 400, message: "already verified" }))
        else return ({ status: 400, message: "Invalid link!" })
    } else return ({ status: 404, message: "user not found!" })
}