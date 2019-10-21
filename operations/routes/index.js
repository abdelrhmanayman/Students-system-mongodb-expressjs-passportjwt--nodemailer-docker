const router = require('express').Router()
const { studentHandelerAddStudent, studentHandelerGetAllStudents, studentHandelerEditStudent, studentHandelerGetStudentDetails, studentHandelerDeleteStudent } = require('../handelers')
const { validateCreateUser, validateEditUser, valitePhoneNumber, validateGetStudentDetails, validateDeleteStudent } = require('qurba-package')

/* 
USER must be logged in to be able to add student, must set token at headers 

body: {
  username: String required,
  email: String, valid email required, 
  mobile: String, valid mobile required
}

returns: username of created student

*/

router.post('/addStudent', async (req, res) => {
    try {
        let { value, error } = validateCreateUser(req.body)
        if (error) throw new Error(error)
        else res.json({ username: await studentHandelerAddStudent(value) })
    } catch (error) { res.sendStatus(400) }
})

/* 

body: {
}

returns: array of students usernames

*/

router.post('/getAllStudents', async (_, res) => {
    try {
        res.json(await studentHandelerGetAllStudents())
    } catch (error) { res.sendStatus(400) }
})

/* 
USER must be logged in and only owner can delete himself, must set token at headers 

body: {
  username: String required
}

returns: "Deleted!" if deletion is done!

*/

router.post('/deleteStudent', async (req, res) => {
    try {
        let { value, error } = validateDeleteStudent(req.body)
        let owner = value.username === req.user.username
        if (error)
            throw new Error(error)
        if (!owner)
            res.status(401).end("Only Owner can delete his own")
        else {
            let { status, message } = await studentHandelerDeleteStudent(value.username)
            res.status(status).end(message)
        }
    } catch (error) { res.sendStatus(400) }
})

/* 
body: {
  username: String required
}
returns: Student full object
*/

router.post('/getStudentDetails', async (req, res) => {
    try {
        let { value, error } = validateGetStudentDetails(req.body)
        if (error)
            throw new Error(error)
        res.json(await studentHandelerGetStudentDetails(value.username))
    } catch (error) {
        res.sendStatus(400)
    }
})

/* 
USER must be logged in and only owner can edit himself, must set token at headers 

body: {
  editWho: String, username, or mobile 
  updates: {
      username: String,
      email: String, valid email
      mobile: String, valid mobile
  }
}

returns: "edited!" if edition is done!

*/

router.post('/editStudent', async (req, res) => {
    try {
        let { value, error } = validateEditUser(req.body)
        let { editWho, updates } = value
        let isMobile = valitePhoneNumber(editWho)
        let owner = isMobile ? req.user.email === editWho : req.user.username === editWho
        if (error)
            throw new Error(error)
        if (!owner)
            res.status(401).end("Only Owner can edit")
        else {
            let { status, message } = await studentHandelerEditStudent(isMobile, editWho, updates)
            res.status(status).end(message)
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(400)
    }
})

module.exports = router