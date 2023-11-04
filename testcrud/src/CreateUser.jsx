import React, { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import FormTemplate from './Form.jsx';

export default function CreateUser(){
    const[formData, setFormData]=useState({
        name: '',
        email: '',
        age: ''
    })
    const navigate = useNavigate()

    const Submit = (e)=>{
        e.preventDefault();
        axios.post("http://localhost:3001/createUser",formData)
        .then(result =>{
            console.log(result)
            navigate('/Home')
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

    return(
        <FormTemplate
            formData={formData}
            action={Submit}
            title="Add User"
            handleChange={handleChange}
            buttonText="Submit"
            loggedIn={true}
        />
    )
}