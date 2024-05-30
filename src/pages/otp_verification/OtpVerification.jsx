import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-hot-toast';
import {ScaleLoader} from "react-spinners"
import '../../styles/RegLog.css'
import userInstance from '../../aaxios_instance/UserAxios';

const OtpVerification = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [loading,setLoading] = useState(false)
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const formData = location.state.formData;
  const phone = location.state.phone;

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true)
  
    try {
      const otpVerificationResponse = await userInstance.post(`/api/users/verifyotp`, { phone, otp });
      if (otpVerificationResponse.data.success) {
        setError(null);
        try {
          const response = await userInstance.post(`/api/users/register`, formData);
          if (response.data.success) {
            toast.success("Registration Success...")
            navigate("/login");
          }
          else {
            setError(response.data.message);
          }
        }
        catch (error) {
          console.error("Error:", error.message);
          setError("An error occurred during registration. Please try again later.");
        }
      } 
      else {
        setError("Invalid OTP. Please try again.");
      }
    }
    catch (error) {
      console.error("Error:", error.message);
      setError("An error occurred. Please try again later.");
    }
    setLoading(false)
  };

  return (
    <div className='wrapper'>
      <h1>Verify OTP</h1>
      <form onSubmit={handleVerify}>
        <input
          className='reg_input'
          type='text'
          name='otp'
          value={otp}
          placeholder='Enter OTP'
          maxLength='6'
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <Button type="submit" className='btn' variant='danger'>VERIFY</Button>
      </form>
      <div className='member'>
        <center>{loading && <ScaleLoader style={{marginTop:"5px"}} color="#e15b64" loading={loading} size={40} />}</center>
          <p>OTP sent. <span>Resend OTP</span></p>
          <p>Sending OTP...</p>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default OtpVerification;
