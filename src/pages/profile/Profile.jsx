import React, { useEffect, useState } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import userInstance from '../../aaxios_instance/UserAxios';
import { Button } from '@mui/material';
import toast from 'react-hot-toast';
import tempLogo from '../../assets/temporary-profile.png'

const Profile = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    
    useEffect(() => {
        if (!localStorage.getItem('userToken')) {
            navigate('/');
        }
    }, [navigate]);
    
    const [profile, setProfile] = useState({});
    const [editProfile, setEditProfile] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [profileImg, setProfileImg] = useState(null);
    const [previewImg, setPreviewImg] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            const response = await userInstance.get(`/api/users/profile/${userId}`);
            setProfile(response.data.data);
            setEditProfile(response.data.data.username);
            setPreviewImg(response.data.data.profileImg);
        };
        fetchUserProfile();
    }, [userId]);

    const handleEditProfile = async () => {
        try {
            if (editProfile.length < 4) {
                setError("Username must be at least 4 letters long.");
                return;
            }

            const formData = new FormData();
            formData.append('username', editProfile);
            if (profileImg) {
                formData.append('profileImg', profileImg);
            }

            await userInstance.put(`/api/users/profile/${userId}`, formData);

            setProfile({ ...profile, username: editProfile });
            localStorage.setItem('username', editProfile);
            setIsEditing(false);
            toast.success("profile updated successfully...")
        } catch (error) {
            console.log(error);
            setError(error.response.data.message);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImg(file);
        setPreviewImg(URL.createObjectURL(file));
        setIsEditing(true); 
    };

    return (
        <div style={{ minHeight: '90vh' }}>
            {profile && (
                <div className='profile-container'>
                    <div className='profile_section'>
                        <div className='profile_main'>
                            <div className='profile_main_left'>
                                <div className='profile_image_wrapper'>
                                    <img 
                                        src={previewImg || tempLogo} 
                                        alt='Profile' 
                                    />
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        style={{ display: 'none' }} 
                                        id="profileImgInput"
                                        onChange={handleImageChange}
                                    />
                                    <label htmlFor="profileImgInput" className='edit-icon'>
                                        <i className='fas fa-edit' />
                                    </label>
                                </div>
                            </div>
                            <div className='profile_main_right'>
                                <h1>{profile.username}</h1>
                                <p>{profile.email}</p>
                            </div>
                            <hr className='profile_hr' />
                        </div>
                    </div>
                    <div className='profile_details'>
                        <form>
                            <label>
                                Name: <input type='text' value={profile.name} readOnly />
                            </label>
                            <label>
                                Username:{' '}
                                <span className='edit_btn_div'>
                                    <i className='fas fa-edit editbtn' onClick={() => setIsEditing(true)} />
                                </span>
                                <input
                                    type='text'
                                    value={editProfile}
                                    onChange={(e) => setEditProfile(e.target.value)}
                                    onFocus={() => setIsEditing(true)}
                                />
                                {error && (<p>{error}</p>)}
                            </label>
                            <label>
                                Email: <input type='text' value={profile.email} readOnly />
                            </label>
                            <label>
                                Phone: <input type='text' value={profile.phone} readOnly />
                            </label>
                        </form>
                        {isEditing && (
                            <span className='save-icon' onClick={handleEditProfile}>
                                <Button variant="contained" color="success">Save</Button>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
