const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const multer = require('multer')
const UserModel = require('./models/Users.js')
const EmployeeModel = require('./models/Employees.js')
const path = require('path')
const fs = require('fs')

const app= express()
app.use(cors())
app.use(express.json())

const dbContent= mongoose.createConnection("mongodb://127.0.0.1:27017/crud")

const userModel = dbContent.model('users',UserModel.schema)

const dbSignIn = mongoose.createConnection("mongodb://127.0.0.1:27017/employees")

const employeeModel = dbSignIn.model('employees',EmployeeModel.schema)

const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        const destinationPath = path.join(__dirname, '..', 'testcrud', 'uploads', 'profile-pictures');
        cb(null, destinationPath);
    },
    filename: (req,file,cb)=>{
        cb(null, Date.now()+'_'+file.originalname)
    }
});

const upload = multer({storage:storage})

app.post('/upload-profile-picture/:id', upload.single('profilePicture'), (req, res) => {
    // Handle the file upload, save the path to the user's profilePicture field, and respond with success or error
    // Example: Update the user's profilePicture field in the database
    const userId = req.params.id;
    const profilePicturePath = 'uploads/profile-pictures/' + req.file.filename;
    employeeModel.findOneAndUpdate({email:userId}, { profilePicture: profilePicturePath })
    .then(users=>res.json(users))
    .catch(err=>res.json(err))
});

// app.post('/update-profile-picture/:id/:profile', upload.single('profilePicture'), (req, res) => {
//     const userId = req.params.id;
//     const profilePicturePath = 'uploads/profile-pictures/' + req.file.filename;
//     const filePath = req.params.profile
//     employeeModel.findOneAndUpdate({email:userId}, { profilePicture: profilePicturePath })
//     .then(users=>{res.json(users)
//         fs.unlink(filePath, (err) => {
//             if (err) {
//               console.error('Error deleting the file:', err);
//             } else {
//               console.log('File deleted successfully');
//             }
//           })})
//     .catch(err=>res.json(err))
// });

app.post("/register",(req, res) =>{
    employeeModel.create(req.body)
    .then(users=>res.json(users))
    .catch(err=>res.json(err))
})

app.post("/login",(req, res) =>{
    const {email,password} = req.body;
    employeeModel.findOne({email:email})
    .then(users=>{
        if(users){
            if(users.password===password){
                res.json("success")
            }
            else{
                res.json("incorrect credential")
            }
        }
        else{
            res.json("incorrect credential")
        }
    })
    .catch(err=>res.json(err))
})

app.get('/', (req, res)=>{
    userModel.find({})
    .then(users=>res.json(users))
    .catch(err=>res.json(err))
})

app.get("/getUser/:id", (req, res) =>{
    const id = req.params.id;
    userModel.findById({_id:id})
    .then(users=>res.json(users))
    .catch(err=>res.json(err))
})

app.get("/get-profile-picture/:email", (req, res) =>{
    const email = req.params.email;
    employeeModel.findOne({email:email})
    .then(users=>res.json(users))
    .catch(err=>res.json(err))
})

app.put("/updateUser/:id", (req, res) =>{
    const id = req.params.id;
    userModel.findByIdAndUpdate({_id:id} ,{
        name:req.body.name, 
        email:req.body.email, 
        age: req.body.age})
    .then(users=>res.json(users))
    .catch(err=>res.json(err))
})

app.post("/createUser",(req, res) =>{
    userModel.create(req.body)
    .then(users=>res.json(users))
    .catch(err=>res.json(err))
})

app.delete('/deleteUser/:id', (req,res) =>{
    const id = req.params.id;
    userModel.findByIdAndDelete({_id:id})
    .then(users=>res.json(users))
    .catch(err=>res.json(err))
})

// app.delete('/delete-profile-picture/:picPath', (req,res) =>{
//     const picPath = req.params.picPath;
//     const pathToDelete = path.join(__dirname, 'testcrud', picPath);
//     fs.unlink(pathToDelete, (err) => {
//     if (err) {
//         console.error('Error deleting the file:', err);
//         console.log(pathToDelete)
//         console.log(__dirname)
//     } else {
//         console.log('File deleted successfully');
//     }
//     });
// })

app.delete('/delete-profile-picture/:fileName', (req, res) => {
    const fileName = decodeURIComponent(req.params.fileName);
    const filePath = path.join(__dirname, '..', 'testcrud', 'uploads', 'profile-pictures', fileName);
  
    // Check if the file exists before trying to delete it
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting the file:', err);
                res.status(500).json({ error: 'Server error', message: err.message });
            } else {
                console.log('File deleted successfully');
                res.json({ message: 'File deleted successfully' });
            }
        });
    } else {
        console.error('File does not exist:', filePath);
        res.status(404).json({ error: 'File not found' });
    }
});

  

app.listen(3001, ()=>{
    console.log("Server is Running")
})