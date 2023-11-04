import React, { useState } from 'react';
import axios from 'axios'
import { json, useNavigate } from 'react-router-dom';
import FormTemplate from './Form.jsx';

export default function CreateUser(){
    const[formData, setFormData]=useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate()

    const Login = (e)=>{
        e.preventDefault();
        axios.post("http://localhost:3001/Login",formData)
        .then(result =>{
            if(result.data === "success"){
                sessionStorage.setItem('userData',JSON.stringify(formData))
                navigate('/Home')
            }
            else{
                console.log(result)
            }
        })
        .catch(err=>console.log(err))
    }

    const handleChange = (e) => {
        const {name,value}=e.target;
        setFormData((prevData)=>({
            ...prevData,
            [name]:value,
        }))
    }
    const handleClick = (e)=>{
        navigate('/Register')
    }

    return(
        <FormTemplate
            formData={formData}
            action={Login}
            title="Login"
            handleChange={handleChange}
            buttonText="Login"
            loggedIn={false}
            redirectButtonText="Go to Register"
            handleClick={handleClick}
        />
    )
}