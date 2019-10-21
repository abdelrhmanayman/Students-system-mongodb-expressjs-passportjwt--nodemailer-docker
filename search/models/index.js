const mongoose = require('mongoose')
const { find, update, save, studentSchema } = require('qurba-package')

const Schema = new mongoose.Schema(studentSchema)

const studentModel = mongoose.model('users', Schema)

module.exports = {
    userModelSelectUserData: args => find({ model: studentModel, ...args }),
    userModelInsert: args => save({ model: studentModel, ...args }),
    userModelUpdateOperations: args => update({ model: studentModel, ...args }),
}
