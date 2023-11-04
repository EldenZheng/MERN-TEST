import React from "react";

export default function form (props){
    return(
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className='w-50 bg-white rounded p-3'>
                <form onSubmit={props.action}>
                    <h2>{props.title}</h2>
                    {props.loggedIn &&(
                        <div className="mb-2">
                            <label htmlFor="">Name</label>
                            <input
                                type="text"
                                placeholder="Enter Name" 
                                className='form-control' 
                                name="name"
                                value={props.formData.name}
                                onChange={props.handleChange}
                            />
                        </div>
                    )}
                    <div className="mb-2">
                        <label htmlFor="">Email</label>
                        <input
                            type="text" 
                            placeholder="Enter Email" 
                            className='form-control' 
                            name="email"
                            value={props.formData.email}
                            onChange={props.handleChange}
                        />
                    </div>
                    {props.loggedIn &&(
                        <div className="mb-2">
                            <label htmlFor="">Age</label>
                            <input
                                type="text" 
                                placeholder="Enter Age" 
                                className='form-control' 
                                name="age"
                                value={props.formData.age}
                                onChange={props.handleChange}
                            />
                        </div>
                    )}
                    {!(props.loggedIn) &&(
                        <div className="mb-2">
                            <label htmlFor="">Age</label>
                            <input
                                type="password" 
                                placeholder="Enter Password" 
                                className='form-control' 
                                name="password"
                                value={props.formData.password}
                                onChange={props.handleChange}
                            />
                        </div>
                    )}
                    <button className="btn btn-success">{props.buttonText}</button>
                </form><br />
                {!(props.loggedIn) && (<button className="btn btn-success" onClick={props.handleClick}>{props.redirectButtonText}</button>)}
            </div>
        </div>
    )
}