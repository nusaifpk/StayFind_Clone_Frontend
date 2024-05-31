import React, { useEffect, useState } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import userInstance from '../../aaxios_instance/UserAxios';

const Profile = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    const [profile, setProfile] = useState({});
    const [editProfile, setEditProfile] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('')

    useEffect(() => {
        if (!localStorage.getItem('userToken')) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const response = await userInstance.get(`http://localhost:5000/api/users/profile/${userId}`);
            setProfile(response.data.data);
            setEditProfile(response.data.data.username);
        };
        fetchUserProfile();
    }, []);

    const handleEditProfile = async () => {
        try {
            if (editProfile.length < 4) {
                setError("Username must be at least 4 letters long.");
                return;
            }

            await userInstance.put(`http://localhost:5000/api/users/profile/${userId}`, { username: editProfile });
            setProfile({ ...profile, username: editProfile });
            localStorage.setItem('username', editProfile);
            setIsEditing(false);
        } catch (error) {
            console.log(error);
            setError(error.response.data.message)
        }
    };


    return (
        <div style={{ minHeight: '90vh' }}>
            {profile && (
                <div className='profile-container'>
                    <div className='profile_section'>
                        <div className='profile_main'>
                            <div className='profile_main_left'>
                                <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog' alt='' />
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
                            <span className='save-icon' onClick={handleEditProfile} >
                                <button >Save</button>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
