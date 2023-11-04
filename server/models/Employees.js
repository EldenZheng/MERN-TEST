const mongoose = require('mongoose')

const EmployeeSchema = new mongoose.Schema({
    email: String,
    password: String,
    profilePicture: String
})

const EmployeeModel = mongoose.model("employees",EmployeeSchema)
module.exports = EmployeeModel