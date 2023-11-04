import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import FormTemplate from './Form.jsx';

export default function UpdateUser(){
    const {id} = useParams()
    const[formData, setFormData]=useState({
        name: '',
        email: '',
        age: ''
    })
    const navigate = useNavigate()

    useEffect(()=>{
        axios.get('http://localhost:3001/getUser/'+id)
        .then(result => {console.log(result)
            setFormData((prevValue)=>({
                ...prevValue,
                name:result.data.name,
                email:result.data.email,
                age:result.data.age
            }))
        })
        .catch(err => console.log(err))
    },[])

    const Update = (e)=>{
        e.preventDefault()
        axios.put("http://localhost:3001/updateUser/"+id,formData)
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
            action={Update}
            title="Update User"
            handleChange={handleChange}
            buttonText="Submit"
            loggedIn={true}
        />
    )
}