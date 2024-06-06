import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import './AdminLogin.css';
import logo from '../../../assets/stayfind.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import adminInstance from '../../../aaxios_instance/AdminAxios';

const AdminLogin = () => {

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await adminInstance.post('/api/admin/admin_login', formData);
      const { token } = response.data;

      localStorage.setItem('adminToken', token);
      toast.success("Admin login success...");
      navigate('/admin');

      setTimeout(() => {
        localStorage.removeItem('adminToken');
        toast.warning("Session expired. Please log in again.");
      }, 3600000);

    }
    catch (error) {
      console.error('Login error:', error);
      toast.error(error.response.data.message)
    }
  };


  return (
    <div className='main_div'>
      <div className="admin_container">
        <img src={logo} alt="" />
        <h4>Admin Login</h4>
        <form onSubmit={handleSubmit}>
          <div className='field'>
            <label>Username</label>
            <input className='admin_input' type="text" name="username" placeholder='username' value={formData.username} onChange={handleChange} required />
          </div>
          <div>
            <label>Password</label>
            <div className="password-input">
              <input className='admin_input' type={showPassword ? "text" : "password"} name="password" placeholder='password' value={formData.password} onChange={handleChange} required />
              <span className="password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <Button className='admin_button' type="submit">Login</Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
