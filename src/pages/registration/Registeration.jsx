import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import '../../styles/RegLog.css';
import { Button } from '@mui/material';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { PropagateLoader } from 'react-spinners';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import userInstance from '../../aaxios_instance/UserAxios';
import ScrollDialog from '../../components/terms/Terms.jsx';

const Registration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const SignupSchema = Yup.object().shape({
    name: Yup.string().min(4, 'Too Short!').max(50, 'Too Long!').required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    phone: Yup.string().matches(/^\d{10}$/, 'Invalid phone number...!').required('Phone number is required...!'),
    username: Yup.string().required('Username is required...!'),
    password: Yup.string().min(4, 'Min 4 character!').required('Password is required...!'),
  });

  // Checkbox validation
  const handleCheckbox = () => {
    setAgree(!agree);
  };

  // Password visibility
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);

    // Checkbox validation
    if (!agree) {
      toast.error('Please agree to the terms & conditions');
      setLoading(false);
      setSubmitting(false);
      return;
    }

    try {
      const otpResponse = await userInstance.post(`/api/users/sentotp`, { phone: values.phone });

      if (otpResponse && otpResponse.status === 200) {
        toast('Oops...Redirecting to OTP verification');
        navigate('/otpverification', { state: { formData: values, phone: values.phone } });
      }
    } catch (error) {
      console.log('Error in registration: ', error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className='wrapper'>
      <h1>Sign Up</h1>
      <Formik
        initialValues={{ name: '', email: '', phone: '', username: '', password: '' }}
        validationSchema={SignupSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field type='text' name='name' className='reg_input' placeholder='Name' />
            <ErrorMessage name='name' component='div' className='error' />

            <Field type='email' name='email' className='reg_input' placeholder='Email' />
            <ErrorMessage name='email' component='div' className='error' />

            <Field type='tel' name='phone' className='reg_input' placeholder='Phone' maxLength='10' />
            <ErrorMessage name='phone' component='div' className='error' />

            <Field type='text' name='username' className='reg_input' placeholder='Username' />
            <ErrorMessage name='username' component='div' className='error' />

            <Field type={showPassword ? 'text' : 'password'} name='password' className='reg_input' placeholder='Password' />
            <ErrorMessage name='password' component='div' className='error' />
            <br />
            <span onClick={togglePassword}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

            <div className='terms'>
              <input type='checkbox' id='checkbox' className='terms_input' checked={agree} onChange={handleCheckbox} />
              <label htmlFor='checkbox'>
                 <ScrollDialog /> 
              </label>
            </div>

            <Button type="submit" className='btn' variant="contained" color="primary" disabled={isSubmitting || loading}>
              {loading ? (
                <PropagateLoader color="#fff" loading={loading} size={10} />
              ) : <div>Sign Up</div>}
            </Button>

            <div className='member'>
              Already a member? <Link to='/login'><u>Login here</u></Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Registration;
