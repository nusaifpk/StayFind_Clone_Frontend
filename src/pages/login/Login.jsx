import React, { useState } from 'react'
import "../../styles/RegLog.css"
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import Button from 'react-bootstrap/esm/Button'
import { SyncLoader } from "react-spinners"
import userInstance from '../../aaxios_instance/UserAxios'

const Login = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }


  const handleToken = (token, userDetails) => {
    const { username, userId, email, name, phone } = userDetails;
    console.log(userDetails)

    localStorage.setItem('userToken', token);
    localStorage.setItem('username', username);
    localStorage.setItem('userId', userId);
    localStorage.setItem('email', email);
    localStorage.setItem('name', name);
    localStorage.setItem('phone', phone);

    setTimeout(() => {
      localStorage.removeItem('userToken');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      localStorage.removeItem('name');
      localStorage.removeItem('phone');
      toast.warning("Session expired. Please log in again.");
    }, 86400000);
  };


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(async () => {
      try {
        const response = await userInstance.post(`/api/users/login`, formData);
        const { token, user } = response.data
        handleToken(token, user)
        toast.success("login success..")
        navigate('/')
      }
      catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        }
        else {
          toast.error(error.message);
        }
      }
      finally {
        setLoading(false)
      }
    }, 2000);
  };



  return (
    <div className='wrapper'>
      <h1>Login</h1>
      <div className='demo'>
        <p>username: test <br />password: test</p>
      </div>
      <form onSubmit={handleSubmit}>
        <input type='text' name='username' className='reg_input' placeholder='Username' onChange={handleChange} required />
        <input type='password' name='password' className='reg_input' placeholder='Password' onChange={handleChange} required />
        <div className='forgot-text'>
          <a>Forgot password?</a>
        </div>
        <Button type='submit' variant='danger' className='btn'>{loading ? (
          <SyncLoader color="#fff" loading={loading} size={5} style={{ alignItems: "center" }} />
        ) : <div>Login</div>}</Button>
      </form>
      <div className='member'>
        Not a member? <Link to='/register'><p className='reg-text'><u>Register now</u></p></Link>
      </div>
    </div>
  )
}

export default Login