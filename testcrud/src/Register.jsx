import React, { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import FormTemplate from './Form.jsx';

export default function CreateUser(){
    const[formData, setFormData]=useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate()

    const Register = (e)=>{
        e.preventDefault();
        axios.post("http://localhost:3001/Register",formData)
        .then(result =>{
            console.log(result)
            navigate('/')
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
        navigate('/')
    }

    return(
        <FormTemplate
            formData={formData}
            action={Register}
            title="Register"
            handleChange={handleChange}
            buttonText="Register"
            loggedIn={false}
            redirectButtonText="Go to Log-in"
            handleClick={handleClick}
        />
    )
}