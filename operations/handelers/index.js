const { userModelInsert, userModelSelectUserData, userModelUpdateOperations, userModelDelete } = require('../models')

exports.studentHandelerAddStudent = (student) => userModelInsert({ one: true, value: student }).then(({ username }) => username)

exports.studentHandelerGetAllStudents = () => userModelSelectUserData({ one: false, selection: { username: 1 } })
exports.studentHandelerGetStudentDetails = (username) => userModelSelectUserData({ one: false, finder: { username }, selection: { password: 0, facebook: 0 } })
exports.studentHandelerDeleteStudent = (username) =>
    userModelDelete({ one: true, finder: { username } }).then(({ deletedCount }) =>
        deletedCount > 0 ? ({ status: 200, message: "Deleted!" }) : ({ status: 400, message: "Didn't delete!" }))
exports.studentHandelerEditStudent = (isMobile, id, updates) => {
    let finder = isMobile ? { mobile: id } : { username: id }
    return userModelSelectUserData({ one: true, finder, selection: { mobile: 1, username: 1 } }).then(user => {
        if (user && (user.username === id || user.mobile === id)) {
            return userModelUpdateOperations({ one: true, finder, updates: { $set: updates } })
                .then(({ n, nModified }) => nModified > 0 ? { status: 200, message: "edited!" } : n > 0 ? { status: 400, message: "no updates happened!" } : { status: 500, message: "Server error!" })
        } else if (user) return ({ status: 400, message: "Only owner can edit!" })
        else return ({ status: 404, message: "Student not found!" })
    })
}
