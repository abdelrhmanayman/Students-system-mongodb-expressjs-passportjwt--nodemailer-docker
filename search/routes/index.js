const router = require('express').Router()
const { validateSearchStudents } = require('qurba-package')
const { searchHandelerSearchStudents } = require('../handelers')

/* 
body: {
    page: number, number of paginated page, requried
    pageLimit: number, number of items per page, requried
    search: {
        username: String optional,
        email: String optional, must be valid email
        mobile: String, must be valid mobile, optional,
        subject: String, optional
    }
}

returns: array of matched Students

*/
router.post('/search', async (req, res) => {
    try {
        let { value, error } = validateSearchStudents(req.body) // validates user entry
        if (error)
            throw new Error(error)
        res.json(await searchHandelerSearchStudents(value))
    } catch (error) {
        res.sendStatus(400)
    }
})

module.exports = router