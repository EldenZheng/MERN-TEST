import axios from "axios";
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

export default function Users(){
    const [users,setUsers]=useState([])
    const [file, setFile] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const userData=JSON.parse(sessionStorage.getItem('userData'))

    const navigate = useNavigate()

    useEffect(()=>{
        axios.get('http://localhost:3001')
        .then(result => setUsers(result.data))
        .catch(err=>console.log(err))
    },[])

    useEffect(() => {
        axios.get('http://localhost:3001/get-profile-picture/'+userData.email)
          .then((response) => {
            setProfilePicture(response.data.profilePicture);
            console.log(response.data)
          })
          .catch((error) => {
            console.error('Error fetching profile picture:', error);
          });
      }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    
    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            await axios.post('http://localhost:3001/upload-profile-picture/'+userData.email, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
            setProfilePicture(URL.createObjectURL(file));
            alert('Profile picture uploaded successfully');
        } catch (error) {
            alert('Profile picture upload failed');
        }
    };

    const handleUpdate = async () => {
        if (!file) return;

        if (profilePicture) {
            const profilePic = profilePicture;
            const parts = profilePic.split('/');
            const filenameWithExtension = parts[parts.length - 1];
            const fileName =  filenameWithExtension.split('.')[0];
            try {
                await axios.delete('http://localhost:3001/delete-profile-picture/'+fileName);
                console.log('Previous profile picture deleted successfully');
            } catch (error) {
                console.error('Error deleting previous profile picture:', error, fileName);
            }
        }

        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            await axios.post('http://localhost:3001/upload-profile-picture/'+userData.email, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
            setProfilePicture(URL.createObjectURL(file));
            alert('Profile picture uploaded successfully');
        } catch (error) {
            alert('Profile picture upload failed');
        }
      };

    const handleDelete = (id) => {
        axios.delete('http://localhost:3001/deleteUser/'+id)
        .then(result=> {console.log(result)
            window.location.reload()})
        .catch(err=>console.log(err))
    }
    const logOut = ()=>{
        sessionStorage.removeItem('userData')
        navigate('/')
    }
    return(
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className='w-50 bg-white rounded p-3'>
                {userData && 
                    <div>
                        <h1>{userData.email}</h1>
                        <div style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                            }}>
                                <img style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                                    src={profilePicture || 'uploads/profile-pictures/default-profile-picture.png'} // Use a default image URL if profilePicture is not set
                                    alt="Profile"
                                />
                        </div>
                        <br/>
                        {profilePicture ? (
                            <>
                                <input type="file" accept=".jpg, .jpeg, .png" onChange={handleFileChange} />
                                <button onClick={handleUpdate}>Change Profile Picture</button>
                            </>
                            
                        ) : (
                            <>
                                <p>Image not yet set</p>
                                <input type="file" accept=".jpg, .jpeg, .png" onChange={handleFileChange} />
                                <button onClick={handleUpload}>Upload Profile Picture</button>
                            </>
                        )}
                        
                    </div>
                }<br/><br/>
                <Link to="/create" className='btn btn-success'>Add +</Link>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Age</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user)=>{
                                return(
                                    <tr>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.age}</td>
                                        <td>
                                            <Link to={`/update/${user._id}`} className='btn btn-success'>Update</Link>
                                            <button className='btn btn-danger' onClick={(e)=>handleDelete(user._id)}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                {userData && <button onClick={logOut}>Log Out</button>}
            </div>
        </div>
    )
}