const { userModelSelectUserData } = require('../models')

exports.searchHandelerSearchStudents = ({ page, search, pageLimit }) => userModelSelectUserData({ one: false, finder: { ...search }, selection: { password: 0 }, limit: pageLimit, skip: pageLimit * (page - 1) })